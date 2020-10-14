package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices._
import com.gu.i18n.Country
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.{PromoCode, Promotion, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.workers._
import com.gu.support.workers.states.{PaymentMethodWithSchedule, SendThankYouEmailState}
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import com.gu.threadpools.CustomPool.executionContext
import com.gu.zuora.ZuoraService
import io.circe.generic.auto._
import org.joda.time.DateTime

import scala.concurrent.Future

case class StateNotValidException(message: String) extends RuntimeException(message)

class SendThankYouEmail(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendThankYouEmailState, List[SendMessageResult]](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: SendThankYouEmailState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    val thankYouEmailService: EmailService = new EmailService(services.config.contributionThanksQueueName)
    for {
      mandateId <- fetchDirectDebitMandateId(state, services.zuoraService)
      emailFields <- Future.fromTry(buildEmail(state, mandateId)
        .left.map(error => new StateNotValidException(s"State was not valid, $error")).toTry)
      emailResult <- Future.sequence(emailFields.map(thankYouEmailService.send))
    } yield HandlerResult(emailResult, requestInfo)
  }

  def fetchDirectDebitMandateId(state: SendThankYouEmailState, zuoraService: ZuoraService): Future[Option[String]] = state.paymentOrRedemptionData match {
    case Left(PaymentMethodWithSchedule(_: DirectDebitPaymentMethod, _)) =>
      zuoraService.getMandateIdFromAccountNumber(state.accountNumber)
    case _ => Future.successful(None)
  }

  def buildEmail(state: SendThankYouEmailState, directDebitMandateId: Option[String] = None): Either[String, List[EmailFields]] =
    state.product match {
      case c: Contribution =>
        state.paymentOrRedemptionData.left.toOption.toRight("can't have a corporate/gift contribution").map(paymentMethodWithSchedule =>
          ContributionEmailFields.build(
            getAllProductEmailFields(state, directDebitMandateId),
            created = DateTime.now(),
            amount = c.amount,
            paymentMethod = paymentMethodWithSchedule.paymentMethod
          )
        ).map(List(_))
      case d: DigitalPack => new DigitalPackEmailFields(getSubscriptionEmailFields(state, directDebitMandateId)).build(
        paidSubPaymentData = state.paymentOrRedemptionData.left.toOption,
        readerType = d.readerType,
        maybeGiftPurchase = state.giftPurchase.flatMap(_.asDigiSub)
      )
      case p: Paper =>
        state.paymentOrRedemptionData.left.toOption.toRight("can't have a corporate/gift paper yet").map(paymentMethodWithSchedule =>
          PaperEmailFields.build(
            getSubscriptionEmailFields(state, directDebitMandateId),
            fulfilmentOptions = p.fulfilmentOptions,
            productOptions = p.productOptions,
            firstDeliveryDate = state.firstDeliveryDate,
            paymentMethodWithSchedule = paymentMethodWithSchedule,
            state.giftPurchase.map(_.giftRecipient)
          )
        ).map(List(_))
      case _: GuardianWeekly =>
        state.paymentOrRedemptionData.left.toOption.toRight("can't have a corporate/gift GW yet").map(paymentMethodWithSchedule =>
          GuardianWeeklyEmailFields.build(
            getSubscriptionEmailFields(state, directDebitMandateId),
            firstDeliveryDate = state.firstDeliveryDate,
            paymentMethodWithSchedule = paymentMethodWithSchedule,
            state.giftPurchase.map(_.giftRecipient)
          )
        ).map(List(_))
    }

  private def getAllProductEmailFields(state: SendThankYouEmailState, directDebitMandateId: Option[String]) = {
    AllProductsEmailFields(
      billingPeriod = state.product.billingPeriod,
      user = state.user,
      currency = state.product.currency,
      sfContactId = SfContactId(state.salesForceContact.Id),
      directDebitMandateId = directDebitMandateId
    )
  }

  private def getSubscriptionEmailFields(state: SendThankYouEmailState, directDebitMandateId: Option[String]) = {

    val readerType = if (state.giftPurchase.isDefined) Gift else Direct
    val productRatePlanId = getProductRatePlanId(state.product, state.user.isTestUser, readerType)
    val maybePromotion = getAppliedPromotion(
      servicesProvider.forUser(state.user.isTestUser).promotionService,
      state.promoCode,
      state.user.billingAddress.country,
      productRatePlanId
    )

    SubscriptionEmailFields(
      getAllProductEmailFields(state, directDebitMandateId),
      state.subscriptionNumber,
      maybePromotion
    )

  }

  def getProductRatePlanId(product: ProductType, isTestUser: Boolean, readerType: ReaderType): ProductRatePlanId = {
    val touchpointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)
    productTypeRatePlan(product, touchpointEnvironment, readerType).map(_.id).getOrElse("")
  }

  private def getAppliedPromotion(
     promotionService: PromotionService,
     maybePromoCode: Option[PromoCode],
     country: Country,
     productRatePlanId: ProductRatePlanId
   ): Option[Promotion] =
    for {
      promoCode <- maybePromoCode
      promotionWithCode <- promotionService.findPromotion(promoCode).toOption
      validPromotion <- promotionService.validatePromotion(promotionWithCode, country, productRatePlanId, isRenewal = false).toOption
    } yield validPromotion.promotion

}
