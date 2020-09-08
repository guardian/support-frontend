package com.gu.support.workers.lambdas

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog
import com.gu.support.catalog._
import com.gu.support.config.{Stage, TouchPointEnvironments, ZuoraConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.GetCodeStatus.RedemptionInvalid
import com.gu.support.redemption._
import com.gu.support.redemption.generator.GiftCodeGeneratorService
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers._
import com.gu.support.workers.lambdas.CreateZuoraSubscription.createSubscription
import com.gu.support.workers.lambdas.DigitalSubscriptionGiftRedemption.{maybeDigitalSubscriptionGiftRedemption, redeemGift}
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, PaymentMethodWithSchedule, SendThankYouEmailState}
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api._
import com.gu.support.zuora.api.response.{Subscription, SubscriptionRedemptionQueryResponse, UpdateRedemptionDataResponse, ZuoraAccountNumber, ZuoraSubscriptionNumber}
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.{ZuoraService, ZuoraSubscribeService}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.buildContributionSubscription
import com.gu.zuora.subscriptionBuilders._
import org.joda.time.{DateTime, DateTimeZone, Days, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

case class BuildSubscribePromoError(cause: PromoError) extends RuntimeException

case class BuildSubscribeRedemptionError(cause: RedemptionInvalid) extends RuntimeException

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
  extends ServicesHandler[CreateZuoraSubscriptionState, SendThankYouEmailState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    val now = () => DateTime.now(DateTimeZone.UTC)
    val today = () => LocalDate.now(DateTimeZone.UTC)
    val promotionService = services.promotionService
    val redemptionService = services.redemptionService
    val zuoraService = services.zuoraService
    val giftCodeGenerator = services.giftCodeGenerator
    val isTestUser = state.user.isTestUser
    val config: ZuoraConfig = services.config.zuoraConfigProvider.get(isTestUser)

    maybeDigitalSubscriptionGiftRedemption(state.product, state.paymentMethod) match {
      case Some(redemptionData) =>
        redeemGift (redemptionData, state.user.id, requestInfo, state, zuoraService, services.catalogService)
      case None =>
        createSubscription (state, requestInfo, now, today, promotionService, redemptionService, zuoraService, giftCodeGenerator, config)
    }
  }
}

object CreateZuoraSubscription {

  import com.gu.FutureLogging._

  def createSubscription(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    now: () => DateTime,
    today: () => LocalDate,
    promotionService: PromotionService,
    redemptionService: DynamoLookup with DynamoUpdate,
    zuoraService: ZuoraSubscribeService,
    giftCodeGenerator: GiftCodeGeneratorService,
    config: ZuoraConfig
  ): Future[HandlerResult[SendThankYouEmailState]] = {
    for {
      subscriptionData <- buildSubscriptionData(state, promotionService, GetCodeStatus.withDynamoLookup(redemptionService), giftCodeGenerator, today, config)
        .withLogging("subscription data")
      subscribeItem = buildSubscribeItem(state, subscriptionData)
      identityId <- Future.fromTry(IdentityId(state.user.id))
        .withLogging("identity id")
      maybeDomainSubscription <- GetSubscriptionWithCurrentRequestId(zuoraService, state.requestId, identityId, state.product.billingPeriod, now)
        .withLogging("GetSubscriptionWithCurrentRequestId")
      paymentOrRedemptionData <-
        state.paymentMethod.leftMap(pm => PreviewPaymentSchedule(subscribeItem, state.product.billingPeriod, zuoraService, checkSingleResponse)
          .withLogging("PreviewPaymentSchedule").map(ps => PaymentMethodWithSchedule(pm, ps))
        ).leftSequence
      (account, sub, info) <- subscribeIfApplicable(requestInfo, zuoraService, subscribeItem, maybeDomainSubscription)
        .withLogging("subscribe")
      _ <- updateRedemptionCodeIfApplicable(state.paymentMethod, SetCodeStatus.withDynamoLookup(redemptionService))
    } yield HandlerResult(getEmailState(state, account, sub, paymentOrRedemptionData), info)
  }

  private def subscribeIfApplicable(
    requestInfo: RequestInfo,
    zuoraService: ZuoraSubscribeService,
    subscribeItem: SubscribeItem,
    maybeDomainSubscription: Option[DomainSubscription]
  ): Future[(ZuoraAccountNumber, ZuoraSubscriptionNumber, RequestInfo)] =
    maybeDomainSubscription match {
      case Some(domainSubscription) => {
        val message = "Skipping subscribe for user because a subscription has already been created for this request"
        SafeLogger.info(message)
        Future.successful((domainSubscription.accountNumber, domainSubscription.subscriptionNumber, requestInfo.appendMessage(message)))
      }
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

  private def getEmailState(
    state: CreateZuoraSubscriptionState,
    accountNumber: ZuoraAccountNumber,
    subscriptionNumber: ZuoraSubscriptionNumber,
    paymentOrRedemptionData: Either[PaymentMethodWithSchedule, RedemptionData]
  ) =
    SendThankYouEmailState(
      state.requestId,
      state.user,
      state.giftRecipient,
      state.product,
      state.paymentProvider,
      paymentOrRedemptionData,
      state.firstDeliveryDate,
      state.promoCode,
      state.salesforceContacts.buyer,
      accountNumber.value,
      subscriptionNumber.value,
      state.acquisitionData
    )

  private def buildSubscribeItem(state: CreateZuoraSubscriptionState, subscriptionData: SubscriptionData): SubscribeItem = {
    val billingEnabled = state.paymentMethod.isLeft
    //Documentation for this request is here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
    SubscribeItem(
      account = buildAccount(state),
      billToContact = buildContactDetails(state.user, None, state.user.billingAddress),
      soldToContact = state.user.deliveryAddress map (buildContactDetails(state.user, state.giftRecipient, _, state.user.deliveryInstructions)),
      paymentMethod = state.paymentMethod.left.toOption,
      subscriptionData = subscriptionData,
      subscribeOptions = SubscribeOptions(generateInvoice = billingEnabled, processPayments = billingEnabled)
    )
  }

  private def buildSubscriptionData(
    state: CreateZuoraSubscriptionState,
    promotionService: => PromotionService,
    getCodeStatus: => GetCodeStatus,
    giftCodeGenerator: GiftCodeGeneratorService,
    today: () => LocalDate,
    config: ZuoraConfig
  ): Future[SubscriptionData] = {
    val isTestUser = state.user.isTestUser
    val environment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)

    val eventualErrorOrSubscriptionData = state.product match {
      case c: Contribution => EitherT.pure[Future, Throwable](buildContributionSubscription(c, state.requestId, config))
      case d: DigitalPack => DigitalSubscriptionBuilder.build(
        d,
        state.requestId,
        state.paymentMethod match {
          case Left(_: PaymentMethod) => SubscriptionPurchase(
            config.digitalPack,
            state.promoCode,
            state.product.billingPeriod,
            state.user.billingAddress.country,
            promotionService
          )
          case Right(rd: RedemptionData) => SubscriptionRedemption(rd, getCodeStatus)
        },
        environment,
        giftCodeGenerator,
        today
      ).leftMap(_.fold(BuildSubscribePromoError, BuildSubscribeRedemptionError))
      case p: Paper => EitherT.fromEither[Future](PaperSubscriptionBuilder.build(
        p,
        state.requestId,
        state.user.billingAddress.country,
        state.promoCode,
        state.firstDeliveryDate,
        promotionService,
        environment
      ).leftMap(BuildSubscribePromoError))
      case w: GuardianWeekly =>
        EitherT.fromEither[Future](GuardianWeeklySubscriptionBuilder.build(
          w,
          state.requestId,
          state.user.billingAddress.country,
          state.promoCode,
          state.firstDeliveryDate,
          promotionService,
          if (state.giftRecipient.isDefined) ReaderType.Gift else ReaderType.Direct,
          environment
        ).leftMap(BuildSubscribePromoError))
    }
    eventualErrorOrSubscriptionData.value.flatMap { errorOrSubscriptionData =>
      Future.fromTry(errorOrSubscriptionData.toTry)
    }
  }

  private def buildContactDetails(user: User, giftRecipient: Option[GiftRecipient], address: Address, deliveryInstructions: Option[String] = None) = {
    ContactDetails(
      firstName = giftRecipient.fold(user.firstName)(_.firstName),
      lastName = giftRecipient.fold(user.lastName)(_.lastName),
      workEmail = giftRecipient.fold(Option(user.primaryEmailAddress))(_.email),
      address1 = address.lineOne,
      address2 = address.lineTwo,
      city = address.city,
      postalCode = address.postCode,
      country = address.country,
      state = address.state,
      deliveryInstructions = deliveryInstructions
    )
  }

  private def buildAccount(state: CreateZuoraSubscriptionState) = Account(
    name = state.salesforceContacts.recipient.AccountId, //We store the Salesforce Account id in the name field
    currency = state.product.currency,
    crmId = state.salesforceContacts.recipient.AccountId, //Somewhere else we store the Salesforce Account id
    sfContactId__c = state.salesforceContacts.recipient.Id,
    identityId__c = state.user.id,
    paymentGateway = state.paymentMethod.left.toOption.map(_.paymentGateway),
    createdRequestId__c = state.requestId.toString,
    autoPay = state.paymentMethod.isLeft
  )

  def updateRedemptionCodeIfApplicable(
    paymentMethod: Either[PaymentMethod, RedemptionData],
    setCodeStatus: SetCodeStatus
  ): Future[Unit] =
    paymentMethod.toOption match {
      case Some(rd: RedemptionData) =>
        setCodeStatus(
          rd.redemptionCode,
          RedemptionTable.AvailableField.CodeIsUsed
        )
      case None => Future.successful(())
    }

}

object DigitalSubscriptionGiftRedemption {

  def maybeDigitalSubscriptionGiftRedemption(product: ProductType, paymentMethod: Either[PaymentMethod, RedemptionData]) = {
    product match {
      case d: DigitalPack if paymentMethod.isRight && d.readerType == Gift => paymentMethod.right.toOption
      case _ => None
    }
  }

  def redeemGift(
    redemptionData: RedemptionData,
    gifteeUserId: String,
    requestInfo: RequestInfo,
    state: CreateZuoraSubscriptionState,
    zuoraService: ZuoraService,
    catalogService: CatalogService
  ): Future[HandlerResult[SendThankYouEmailState]] =
    for {
      giftSubscriptionFields <- zuoraService.getSubscriptionFromRedemptionCode(redemptionData.redemptionCode)
      validatedSubscription <- Future.fromTry(validateRedemptionData(giftSubscriptionFields))
      fullGiftSubscription <- zuoraService.getSubscriptionById(validatedSubscription.id)
      newTermLength <- Future.fromTry(calculateNewTermLength(fullGiftSubscription, catalogService))
      updateDataResponse <- zuoraService.updateSubscriptionRedemptionData(validatedSubscription.id, gifteeUserId, newTermLength)
      handlerResult <- Future.fromTry(buildHandlerResult(updateDataResponse, state, redemptionData, requestInfo))
    } yield handlerResult

  def validateRedemptionData(existingSub: SubscriptionRedemptionQueryResponse) = {
    existingSub.records.headOption.map(
      existingSubFields =>
        if (existingSubFields.gifteeIdentityId.isEmpty)
          Success(existingSubFields)
        else
          Failure(new RuntimeException(GetCodeStatus.CodeAlreadyUsed.clientCode))
    ).getOrElse(Failure(new RuntimeException(GetCodeStatus.NoSuchCode.clientCode)))
  }

  def calculateNewTermLength(subscription: Subscription, catalogService: CatalogService) = {
    (for {
      ratePlan <- subscription.ratePlans.headOption
      productRatePlan <- catalogService.getProductRatePlanFromId(catalog.DigitalPack, ratePlan.productRatePlanId)
      newEndDate = LocalDate.now()
        .toDateTimeAtStartOfDay
        .plusDays(1) //To avoid having to think about time zones
        .plusMonths(productRatePlan.billingPeriod.monthsInPeriod)
        .toLocalDate
      newTermLength = Days.daysBetween(subscription.customerAcceptanceDate, newEndDate).getDays
    } yield Success(newTermLength)).getOrElse(Failure(new RuntimeException(s"Unable to calculate new term length for subscription ${subscription}")))
  }

  def buildHandlerResult(
    response: UpdateRedemptionDataResponse,
    state: CreateZuoraSubscriptionState,
    redemptionData: RedemptionData,
    requestInfo: RequestInfo
  ) =
    if (response.success) {
      Success(
        HandlerResult(SendThankYouEmailState(
          state.requestId,
          state.user,
          state.giftRecipient,
          state.product,
          state.paymentProvider,
          Right(redemptionData),
          state.firstDeliveryDate,
          state.promoCode,
          state.salesforceContacts.buyer,
          "", //TODO: Should these be Options?
          "",
          state.acquisitionData
        ), requestInfo)
      )
    } else
      Failure(new RuntimeException("Failed to redeem Digital Subscription gift"))

}
