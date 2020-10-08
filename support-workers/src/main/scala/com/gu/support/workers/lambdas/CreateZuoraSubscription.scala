package com.gu.support.workers.lambdas

import cats.implicits._
import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog
import com.gu.support.catalog._
import com.gu.support.config.{TouchPointEnvironments, ZuoraConfig}
import com.gu.support.promotions.PromotionService
import com.gu.support.redemption._
import com.gu.support.redemption.corporate._
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers._
import com.gu.support.workers.lambdas.DigitalSubscriptionGiftRedemption.{maybeDigitalSubscriptionGiftRedemption, redeemGift}
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, PaymentMethodWithSchedule, SendThankYouEmailState}
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api._
import com.gu.support.zuora.api.response.{Subscription, UpdateRedemptionDataResponse, ZuoraAccountNumber, ZuoraSubscriptionNumber}
import com.gu.support.zuora.domain.DomainSubscription
import com.gu.zuora.subscriptionBuilders._
import com.gu.zuora.{ZuoraGiftService, ZuoraSubscribeService}
import org.joda.time.{DateTime, DateTimeZone, Days, LocalDate}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

class CreateZuoraSubscription(servicesProvider: ServiceProvider = ServiceProvider)
  extends ServicesHandler[CreateZuoraSubscriptionState, SendThankYouEmailState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {

    val createSubscription = {
      val now = () => DateTime.now(DateTimeZone.UTC)
      val isTestUser = state.user.isTestUser
      val config: ZuoraConfig = services.config.zuoraConfigProvider.get(isTestUser)
      new ZuoraSubscriptionCreator(now, services.promotionService, services.redemptionService, services.zuoraService, services.giftCodeGenerator, config)
    }

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
  promotionService: PromotionService,
  redemptionService: DynamoLookup with DynamoUpdate,
  zuoraService: ZuoraSubscribeService,
  giftCodeGenerator: GiftCodeGeneratorService,
  config: ZuoraConfig,
) {
  def today(): LocalDate = now().toLocalDate
  import com.gu.FutureLogging._

  def create(
    state: CreateZuoraSubscriptionState,
    requestInfo: RequestInfo,
  ): Future[HandlerResult[SendThankYouEmailState]] = {
    import ZuoraSubscriptionCreator._
    val subscriptionDataBuilder = {
      val corporateCodeValidator = CorporateCodeValidator.withDynamoLookup(redemptionService)
      val dsPurchaseBuilder = new DigitalSubscriptionPurchaseBuilder(config.digitalPack, promotionService, giftCodeGenerator, today)
      val dsRedemptionBuilder = new DigitalSubscriptionCorporateRedemptionBuilder(corporateCodeValidator, today)
      new SubscriptionBuilder(dsPurchaseBuilder, dsRedemptionBuilder, promotionService, config.contributionConfig _)
    }
    val corporateCodeStatusUpdater = CorporateCodeStatusUpdater.withDynamoUpdate(redemptionService)
    val environment = TouchPointEnvironments.fromStage(Configuration.stage, state.user.isTestUser)

    for {
      subscriptionData <- subscriptionDataBuilder.build(state, environment).value.map(_.toTry).flatMap(Future.fromTry)
        .withLogging("subscription data")
      subscribeItem = SubscribeItemBuilder.build(state, subscriptionData)
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
      _ <- updateRedemptionCodeIfApplicable(state.paymentMethod, corporateCodeStatusUpdater)
    } yield HandlerResult(getEmailState(state, account, sub, paymentOrRedemptionData), info)
  }

}

object ZuoraSubscriptionCreator {

  def subscribeIfApplicable(
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

  def getEmailState(
    state: CreateZuoraSubscriptionState,
    accountNumber: ZuoraAccountNumber,
    subscriptionNumber: ZuoraSubscriptionNumber,
    paymentOrRedemptionData: Either[PaymentMethodWithSchedule, RedemptionData]
  ): SendThankYouEmailState =
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

object DigitalSubscriptionGiftRedemption {

  def maybeDigitalSubscriptionGiftRedemption(
    product: ProductType,
    paymentMethod: Either[PaymentMethod, RedemptionData]
  ): Option[RedemptionData] =
    product match {
      case d: DigitalPack if paymentMethod.isRight && d.readerType == Gift => paymentMethod.right.toOption
      case _ => None
    }

  def redeemGift(
    redemptionData: RedemptionData,
    requestInfo: RequestInfo,
    state: CreateZuoraSubscriptionState,
    zuoraService: ZuoraGiftService,
    catalogService: CatalogService
  ): Future[HandlerResult[SendThankYouEmailState]] = {
    val codeValidator = new GiftCodeValidator(zuoraService)
    codeValidator
      .getStatus(redemptionData.redemptionCode, Some(state.requestId.toString))
      .flatMap {
        case ValidGiftCode(subscriptionId) => redeemInZuora(subscriptionId, state, redemptionData, requestInfo, zuoraService, catalogService)
        case CodeRedeemedInThisRequest => Future.fromTry(buildHandlerResult(UpdateRedemptionDataResponse(true), state, redemptionData, requestInfo))
        case otherState: CodeStatus => Future.failed(new RuntimeException(otherState.clientCode))
      }
  }

  private def redeemInZuora(
    subscriptionId: String,
    state: CreateZuoraSubscriptionState,
    redemptionData: RedemptionData,
    requestInfo: RequestInfo,
    zuoraService: ZuoraGiftService,
    catalogService: CatalogService
  ) = for {
    fullGiftSubscription <- zuoraService.getSubscriptionById(subscriptionId)
    newTermLength <- Future.fromTry(calculateNewTermLength(fullGiftSubscription, catalogService))
    updateDataResponse <- zuoraService.updateSubscriptionRedemptionData(subscriptionId, state.requestId.toString, state.user.id, newTermLength)
    handlerResult <- Future.fromTry(buildHandlerResult(updateDataResponse, state, redemptionData, requestInfo))
  } yield handlerResult


  private def calculateNewTermLength(subscription: Subscription, catalogService: CatalogService) = {
    (for {
      ratePlan <- subscription.ratePlans.headOption
      productRatePlan <- catalogService.getProductRatePlanFromId(catalog.DigitalPack, ratePlan.productRatePlanId)
      startDate = LocalDate.now() // TODO needed for thank you email
      newEndDate = startDate
        .toDateTimeAtStartOfDay
        .plusDays(1) //To avoid having to think about time zones
        .plusMonths(productRatePlan.billingPeriod.monthsInPeriod)
        .toLocalDate
      newTermLength = Days.daysBetween(subscription.customerAcceptanceDate, newEndDate).getDays // TODO needed for thank you email
    } yield Success(newTermLength)).getOrElse(Failure(new RuntimeException(s"Unable to calculate new term length for subscription ${subscription}")))
  }

  private def buildHandlerResult(
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
