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
import com.gu.threadpools.CustomPool.executionContext
import com.gu.zuora.ZuoraService
import io.circe.generic.auto._
import org.joda.time.DateTime

import scala.concurrent.Future

class SendThankYouEmail(thankYouEmailService: EmailService, servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendThankYouEmailState, SendMessageResult](servicesProvider) {

  def this() = this(new EmailService)

  override protected def servicesHandler(
    state: SendThankYouEmailState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    for {
      mandateId <- fetchDirectDebitMandateId(state, services.zuoraService)
      emailResult <- sendEmail(state, mandateId)
    } yield HandlerResult(emailResult, requestInfo)
  }

  def fetchDirectDebitMandateId(state: SendThankYouEmailState, zuoraService: ZuoraService): Future[Option[String]] = state.paymentOrRedemptionData match {
    case Left(_: PaymentMethodWithSchedule) =>
      zuoraService.getMandateIdFromAccountNumber(state.accountNumber)
    case _ => Future.successful(None)
  }

  def getProductRatePlanId(product: ProductType, isTestUser: Boolean, isGift: Boolean): ProductRatePlanId = {
    val touchpointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)
    product.productRatePlan(touchpointEnvironment, isGift).map(_.id).getOrElse("")
  }

  def sendEmail(state: SendThankYouEmailState, directDebitMandateId: Option[String] = None): Future[SendMessageResult] = {
    val productRatePlanId = getProductRatePlanId(state.product, state.user.isTestUser, state.giftRecipient.isDefined)
    val maybePromotion = getAppliedPromotion(
      servicesProvider.forUser(state.user.isTestUser).promotionService,
      state.promoCode,
      state.user.billingAddress.country,
      productRatePlanId
    )

    val subscriptionEmailFields: Either[String, SubscriptionEmailFields] = state.paymentOrRedemptionData.left.toOption.toRight("can't send a corporate/gift email yet").map(paymentMethodWithSchedule =>
      state.product match {
        case c: Contribution => SubscriptionEmailFields.wrap(
          ContributionEmailFields(
            created = DateTime.now(),
            amount = c.amount,
            paymentMethod = paymentMethodWithSchedule.paymentMethod
          )
        )
        case _: DigitalPack => DigitalPackEmailFields(
          paymentMethodWithSchedule = paymentMethodWithSchedule,
        )
        case p: Paper => PaperEmailFields(
          fulfilmentOptions = p.fulfilmentOptions,
          productOptions = p.productOptions,
          firstDeliveryDate = state.firstDeliveryDate,
          paymentMethodWithSchedule = paymentMethodWithSchedule,
          state.giftRecipient
        )
        case g: GuardianWeekly => GuardianWeeklyEmailFields(
          fulfilmentOptions = g.fulfilmentOptions,
          firstDeliveryDate = state.firstDeliveryDate,
          paymentMethodWithSchedule = paymentMethodWithSchedule,
          state.giftRecipient
        )
      }
    )
    subscriptionEmailFields match {
      case Right(subscriptionEmailFields) =>
        thankYouEmailService.send(
          subscriptionEmailFields(
            state.subscriptionNumber,
            maybePromotion
          )(
            billingPeriod = state.product.billingPeriod,
            user = state.user,
            currency = state.product.currency,
            sfContactId = SfContactId(state.salesForceContact.Id),
            directDebitMandateId = directDebitMandateId
          )
        )
      case Left(error) => Future.failed(new Throwable(s"RETRY NONE TODO, $error"))
    }
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
