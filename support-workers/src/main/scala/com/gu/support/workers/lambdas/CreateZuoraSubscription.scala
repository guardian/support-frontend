package com.gu.support.workers.lambdas

import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog
import com.gu.support.catalog.{CatalogService, ProductRatePlan, Product}
import com.gu.support.config.{TouchPointEnvironments, ZuoraConfig}
import com.gu.support.promotions.PromotionService
import com.gu.support.redemption._
import com.gu.support.redemption.corporate._
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.GiftRecipient.DigitalSubscriptionGiftRecipient
import com.gu.support.workers._
import com.gu.support.workers.lambdas.DigitalSubscriptionGiftRedemption.{maybeDigitalSubscriptionGiftRedemption, redeemGift}
import com.gu.support.workers.lambdas.NextState.{DigitalSubscriptionGiftPurchaseDetails, PaymentMethodWithSchedule}
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendAcquisitionEventState}
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api.{ReaderType, SubscribeItem, SubscribeRequest}
import com.gu.support.zuora.api.response.{RatePlan, Subscription, ZuoraAccountNumber, ZuoraSubscriptionNumber, ZuoraSuccessOrFailureResponse}
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.subscriptionBuilders._
import com.gu.zuora.{ZuoraGiftService, ZuoraSubscribeService}
import org.joda.time.{DateTime, DateTimeZone, Days, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success, Try}

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
  extends ServicesHandler[CreateZuoraSubscriptionState, SendAcquisitionEventState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {

    val createSubscription = ZuoraSubscriptionCreator(
      () => DateTime.now(DateTimeZone.UTC),
      services.promotionService,
      services.redemptionService,
      services.zuoraService,
      services.giftCodeGenerator,
      services.config.zuoraConfigProvider.get(state.user.isTestUser),
      state.user.isTestUser,
    )

    maybeDigitalSubscriptionGiftRedemption(state.product, state.paymentMethod) match {
      case Some(redemptionData) =>
        redeemGift(redemptionData, requestInfo, state, services.zuoraGiftService, services.catalogService)
      case None =>
        createSubscription.create(state, requestInfo)
    }
  }
}

class ZuoraSubscriptionCreator(
  now: () => DateTime,
  zuoraService: ZuoraSubscribeService,
  subscriptionDataBuilder: SubscriptionDataBuilder,
  corporateCodeStatusUpdater: CorporateCodeStatusUpdater,
  giftCodeGeneratorService: GiftCodeGeneratorService,
) {
  import com.gu.WithLoggingSugar._

  def create(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
  ): Future[HandlerResult[SendAcquisitionEventState]] = {
    import ZuoraSubscriptionCreator._

    val maybeDigitalSubscriptionGiftCreationDetails = for {
      giftRecipient <- state.giftRecipient
      digitalSubscriptionGiftCreationDetails <- addDigitalSubscriptionGiftCreationDetails(state.product.billingPeriod, giftRecipient, () => now().toLocalDate)
        .withLogging("gift recipient with code")
    } yield digitalSubscriptionGiftCreationDetails
    val maybeGeneratedGiftCode = maybeDigitalSubscriptionGiftCreationDetails.map(_.giftCode)
    for {
      subscriptionData <- subscriptionDataBuilder.build(state, maybeGeneratedGiftCode).value.map(_.toTry).flatMap(Future.fromTry)
        .withEventualLogging("subscription data")
      subscribeItem = SubscribeItemBuilder.build(state, subscriptionData)
      identityId <- Future.fromTry(IdentityId(state.user.id))
        .withEventualLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(zuoraService, state.requestId, identityId, state.product.billingPeriod, now)
        .withEventualLogging("GetSubscriptionWithCurrentRequestId")
      paymentOrRedemptionData <-
        state.paymentMethod.leftMap(pm => PreviewPaymentSchedule(subscribeItem, state.product.billingPeriod, zuoraService, checkSingleResponse)
          .withEventualLogging("PreviewPaymentSchedule").map(ps => PaymentMethodWithSchedule(pm, ps))
        ).leftSequence
      (account, sub, info) <- subscribeIfApplicable(requestInfo, zuoraService, subscribeItem, maybeDomainSubscription)
        .withEventualLogging("subscribe")
      _ <- updateRedemptionCodeIfApplicable(state.paymentMethod, corporateCodeStatusUpdater)
        .withEventualLogging("update redemption code")
    } yield HandlerResult(new NextState(state, account, sub).getEmailState(paymentOrRedemptionData, maybeDigitalSubscriptionGiftCreationDetails), info)
  }

  private def addDigitalSubscriptionGiftCreationDetails(billingPeriod: BillingPeriod, giftRecipient: GiftRecipient, today: () => LocalDate) =
    giftRecipient match {
      case digitalSubscriptionGiftRecipient: DigitalSubscriptionGiftRecipient =>
        val giftCode = giftCodeGeneratorService.generateCode(billingPeriod)
          .withLogging("Generated code for Digital Subscription gift")
        val lastRedemptionDate = today().plusMonths(GiftCodeValidator.expirationTimeInMonths).minusDays(1)
        Some(DigitalSubscriptionGiftPurchaseDetails(digitalSubscriptionGiftRecipient, giftCode, lastRedemptionDate))
      case _ =>
        None
    }

}

object ZuoraSubscriptionCreator {

  def apply(
    now: () => DateTime,
    promotionService: PromotionService,
    redemptionService: DynamoLookup with DynamoUpdate,
    zuoraService: ZuoraSubscribeService,
    giftCodeGenerator: GiftCodeGeneratorService,
    config: ZuoraConfig,
    isTestUser: Boolean,
  ): ZuoraSubscriptionCreator =
    new ZuoraSubscriptionCreator(
      now,
      zuoraService,
      new SubscriptionDataBuilder(
        new DigitalSubscriptionPurchaseBuilder(config.digitalPack, promotionService, () => now().toLocalDate),
        new DigitalSubscriptionCorporateRedemptionBuilder(
          CorporateCodeValidator.withDynamoLookup(redemptionService),
          () => now().toLocalDate
        ),
        promotionService,
        config.contributionConfig,
        TouchPointEnvironments.fromStage(Configuration.stage, isTestUser),
      ),
      CorporateCodeStatusUpdater.withDynamoUpdate(redemptionService),
      giftCodeGenerator
    )

  def subscribeIfApplicable(
    requestInfo: RequestInfo,
    zuoraService: ZuoraSubscribeService,
    subscribeItem: SubscribeItem,
    maybeDomainSubscription: Option[DomainSubscription]
  ): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber, RequestInfo)] =
    maybeDomainSubscription match {
      case Some(domainSubscription) =>
        val message = "Skipping subscribe for user because a subscription has already been created for this request"
        SafeLogger.info(message)
        Future.successful((domainSubscription.accountNumber, domainSubscription.subscriptionNumber, requestInfo.appendMessage(message)))
      case None => checkSingleResponse(zuoraService.subscribe(SubscribeRequest(List(subscribeItem)))).map { response =>
        (response.domainAccountNumber, response.domainSubscriptionNumber, requestInfo)
      }
    }

  def checkSingleResponse[ResponseItem](response: Future[List[ResponseItem]]): Future[ResponseItem] = {
    response.flatMap {
      case result :: Nil => Future.successful(result)
      case results => Future.failed(new RuntimeException(s"didn't get a single response item, got: $results"))
    }
  }

  def updateRedemptionCodeIfApplicable(
    paymentMethod: Either[PaymentMethod, RedemptionData],
    corporateCodeStatusUpdater: CorporateCodeStatusUpdater
  ): Future[Unit] =
    paymentMethod.toOption match {
      case Some(rd: RedemptionData) =>
        corporateCodeStatusUpdater.setStatus(
          rd.redemptionCode,
          RedemptionTable.AvailableField.CodeIsUsed
        )
      case None => Future.successful(())
    }

}

object NextState {

  case class DigitalSubscriptionGiftPurchaseDetails(
    giftRecipient: DigitalSubscriptionGiftRecipient,
    giftCode: GeneratedGiftCode,
    lastRedemptionDate: LocalDate,
  )
  case class PaymentMethodWithSchedule(paymentMethod: PaymentMethod, paymentSchedule: PaymentSchedule)

}

class NextState(
  state: CreateZuoraSubscriptionState,
  accountNumber: ZuoraAccountNumber,
  subscriptionNumber: ZuoraSubscriptionNumber,
) {

  def getEmailState(
    paymentOrRedemptionData: Either[PaymentMethodWithSchedule, RedemptionData],
    maybeDigitalSubscriptionGiftCreationDetails: Option[DigitalSubscriptionGiftPurchaseDetails],
  ): SendAcquisitionEventState =
    SendAcquisitionEventState(
      requestId = state.requestId,
      analyticsInfo = state.analyticsInfo,
      sendThankYouEmailState = getProductSpecificState(
        paymentOrRedemptionData,
        maybeDigitalSubscriptionGiftCreationDetails
      ),
      acquisitionData = state.acquisitionData
    )

  val Purchase = Left
  type Redemption = Right[PaymentMethodWithSchedule, RedemptionData]

  // scalastyle:off cyclomatic.complexity
  private def getProductSpecificState(
    paymentOrRedemptionData: Either[PaymentMethodWithSchedule, RedemptionData],
    maybeDigitalSubscriptionGiftCreationDetails: Option[DigitalSubscriptionGiftPurchaseDetails]
  ) =
    (state.product, paymentOrRedemptionData) match {
      case (product: Contribution, Purchase(purchase)) =>
        contribution(product, purchase)
      case (product: DigitalPack, Purchase(purchase)) if product.readerType == ReaderType.Direct =>
        dsDirect(product, purchase)
      case (product: DigitalPack, Purchase(purchase)) if product.readerType == ReaderType.Gift =>
        dsGift(product, purchase, maybeDigitalSubscriptionGiftCreationDetails.get)
      case (product: Paper, Purchase(purchase)) =>
        paper(product, purchase)
      case (product: GuardianWeekly, Purchase(purchase)) =>
        weekly(product, purchase)
      case (product: DigitalPack, _: Redemption) if product.readerType == ReaderType.Corporate =>
        dsCorporate(product)
      case (product: DigitalPack, _: Redemption) if product.readerType == ReaderType.Gift =>
        throw new RuntimeException("wrong code path for gift redemption")
      case _ => throw new RuntimeException("could not create value state")
    }
  // scalastyle:on cyclomatic.complexity

  private def contribution(product: Contribution, purchase: PaymentMethodWithSchedule) =
    SendThankYouEmailContributionState(
      state.user,
      product,
      purchase.paymentMethod,
      accountNumber.value,
      subscriptionNumber.value
    )

  private def dsCorporate(product: DigitalPack) =
    SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(
      state.user,
      product,
      accountNumber.value,
      subscriptionNumber.value
    )

  private def weekly(product: GuardianWeekly, purchase: PaymentMethodWithSchedule) =
    SendThankYouEmailGuardianWeeklyState(
      state.user,
      product,
      state.giftRecipient.map(_.asWeekly.get),
      purchase.paymentMethod,
      purchase.paymentSchedule,
      state.promoCode,
      accountNumber.value,
      subscriptionNumber.value,
      state.firstDeliveryDate.get
    )

  private def paper(product: Paper, purchase: PaymentMethodWithSchedule) =
    SendThankYouEmailPaperState(
      state.user,
      product,
      purchase.paymentMethod,
      purchase.paymentSchedule,
      state.promoCode,
      accountNumber.value,
      subscriptionNumber.value,
      state.firstDeliveryDate.get
    )

  private def dsGift(product: DigitalPack, purchase: PaymentMethodWithSchedule, giftPurchase: DigitalSubscriptionGiftPurchaseDetails) =
    SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
      state.user,
      SfContactId(state.salesforceContacts.giftRecipient.get.Id),
      product,
      giftPurchase.giftRecipient,
      giftPurchase.giftCode,
      giftPurchase.lastRedemptionDate,
      purchase.paymentMethod,
      purchase.paymentSchedule,
      state.promoCode,
      accountNumber.value,
      subscriptionNumber.value
    )

  private def dsDirect(product: DigitalPack, purchase: PaymentMethodWithSchedule) =
    SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
      state.user,
      product,
      purchase.paymentMethod,
      purchase.paymentSchedule,
      state.promoCode,
      accountNumber.value,
      subscriptionNumber.value
    )

}

object DigitalSubscriptionGiftRedemption {

  def maybeDigitalSubscriptionGiftRedemption(
    product: ProductType,
    paymentMethod: Either[PaymentMethod, RedemptionData]
  ): Option[RedemptionData] =
    product match {
      case d: DigitalPack if paymentMethod.isRight && d.readerType == Gift => paymentMethod.toOption
      case _ => None
    }

  def redeemGift(
    redemptionData: RedemptionData,
    requestInfo: RequestInfo,
    state: CreateZuoraSubscriptionState,
    zuoraService: ZuoraGiftService,
    catalogService: CatalogService
  ): Future[HandlerResult[SendAcquisitionEventState]] = {
    val codeValidator = new GiftCodeValidator(zuoraService)
    val zuoraUpdater = new ZuoraUpdater(zuoraService, catalogService)
    for {
      codeValidation <- codeValidator.getStatus(redemptionData.redemptionCode, Some(state.requestId.toString))
      (subscriptionNumber, termDates, billingPeriod) <- codeValidation match {
        case ValidGiftCode(subscriptionId) => zuoraUpdater.doZuoraUpdates(
          subscriptionId,
          zuoraService.updateSubscriptionRedemptionData(subscriptionId, state.requestId.toString, state.user.id, LocalDate.now(), _),
        )
        case CodeRedeemedInThisRequest(subscriptionId) => zuoraUpdater.doZuoraUpdates(
          subscriptionId,
          (_: Int) => Future.successful(ZuoraSuccessOrFailureResponse(success = true, None)),
        )
        case otherState: CodeStatus => Future.failed(new RuntimeException(otherState.clientCode))
      }
      // The product.billingPeriod contained in the state is incorrect at this point because we
      // don't know it in support-frontend. Set it to the correct value here so that we can use
      // it in the UpdateSupporterProductData lambda
      productWithCorrectBillingPeriod = DigitalPack(state.product.currency, billingPeriod, Gift)
      handlerResult <- Future.fromTry(
        buildHandlerResult(
          state.copy(product = productWithCorrectBillingPeriod), requestInfo, subscriptionNumber, termDates)
      )
    } yield handlerResult
  }

  private def buildHandlerResult(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    subscriptionNumber: ZuoraSubscriptionNumber,
    termDates: TermDates,
  ) = {
    val product = state.product match {
      case d: DigitalPack => d
      case _ => throw new RuntimeException("this can't happen")
    }
    Success(
      HandlerResult(SendAcquisitionEventState(
        requestId = state.requestId,
        analyticsInfo = state.analyticsInfo,
        sendThankYouEmailState = SendThankYouEmailDigitalSubscriptionGiftRedemptionState(
          state.user,
          product,
          subscriptionNumber.value,
          termDates
        ),
        acquisitionData = state.acquisitionData
      ), requestInfo)
    )
  }

  class ZuoraUpdater(
    zuoraService: ZuoraGiftService,
    catalogService: CatalogService
  ){
    def doZuoraUpdates(
      subscriptionId: String,
      updateGiftIdentityIdCall: Int => Future[ZuoraSuccessOrFailureResponse]
    ): Future[(ZuoraSubscriptionNumber, TermDates, BillingPeriod)] = for {
      fullGiftSubscription <- zuoraService.getSubscriptionById(subscriptionId)
      productRatePlan <- Future.fromTry(getDigitalSubProductRatePlan(fullGiftSubscription, catalogService))
      calculatedDates <- Future.successful(calculateNewTermLength(productRatePlan, fullGiftSubscription.customerAcceptanceDate))
      (dates, newTermLength) = calculatedDates
      _ <- updateGiftIdentityIdCall(newTermLength)
      _ <- zuoraService.setupRevenueRecognition(fullGiftSubscription, dates)
    } yield (ZuoraSubscriptionNumber(fullGiftSubscription.subscriptionNumber), dates, productRatePlan.billingPeriod)


    private def calculateNewTermLength(productRatePlan: ProductRatePlan[Product], customerAcceptanceDate: LocalDate) = {
      val termDates = getStartEndDates(productRatePlan.billingPeriod.monthsInPeriod)
      val newTermLength = Days.daysBetween(customerAcceptanceDate, termDates.giftEndDate).getDays + 1 //To avoid having to think about time zones
      (termDates, newTermLength)
    }

    private def getDigitalSubProductRatePlan(subscription: Subscription, catalogService: CatalogService) =
      subscription.ratePlans
        .find(ratePlan => catalogService.getProductRatePlanFromId(catalog.DigitalPack, ratePlan.productRatePlanId).isDefined)
        .flatMap(ratePlan => catalogService.getProductRatePlanFromId(catalog.DigitalPack, ratePlan.productRatePlanId))
        .map(Success(_))
        .getOrElse(Failure(new RuntimeException(s"Unable to calculate new term length for subscription $subscription")))

    private def getStartEndDates(months: Int) = {
      val startDate = LocalDate.now()
      val newEndDate = startDate
        .toDateTimeAtStartOfDay
        .plusMonths(months)
        .toLocalDate
      TermDates(startDate, newEndDate, months)
    }
  }
}
