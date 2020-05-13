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
import com.gu.support.workers.states.{PaidProduct, SendThankYouEmailState}
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

  def fetchDirectDebitMandateId(state: SendThankYouEmailState, zuoraService: ZuoraService): Future[Option[String]] = state.paymentMethod match {
    case PaidProduct(_: DirectDebitPaymentMethod) =>
      zuoraService.getMandateIdFromAccountNumber(state.accountNumber)
    case _ => Future.successful(None)
  }

  def getProductRatePlanId(product: ProductType, isTestUser: Boolean, isGift: Boolean): ProductRatePlanId = {
    val touchpointEnvironment = TouchPointEnvironments.fromStage(Configuration.stage, isTestUser)
    product.productRatePlan(touchpointEnvironment, isGift).map(_.id).getOrElse("")
  }

  def sendEmail(state: SendThankYouEmailState, directDebitMandateId: Option[String] = None): Future[SendMessageResult] = {
    val productRatePlanId =  getProductRatePlanId(state.product, state.user.isTestUser, state.giftRecipient.isDefined)
    val maybePromotion = getAppliedPromotion(
      servicesProvider.forUser(state.user.isTestUser).promotionService,
      state.promoCode,
      state.user.billingAddress.country,
      productRatePlanId
    )

    thankYouEmailService.send(
      state.product match {
        case c: Contribution => ContributionEmailFields(
          email = state.user.primaryEmailAddress,
          created = DateTime.now(),
          amount = c.amount,
          currency = c.currency,
          edition = state.user.billingAddress.country.alpha2,
          name = state.user.firstName,
          billingPeriod = state.product.billingPeriod,
          sfContactId = SfContactId(state.salesForceContact.Id),
          paymentMethod = state.paymentMethod,
          directDebitMandateId = directDebitMandateId
        )
        case d: DigitalPack => DigitalPackEmailFields(
          subscriptionNumber = state.subscriptionNumber,
          billingPeriod = d.billingPeriod,
          user = state.user,
          paymentSchedule = state.paymentSchedule,
          currency = d.currency,
          paymentMethod = state.paymentMethod,
          sfContactId = SfContactId(state.salesForceContact.Id),
          directDebitMandateId = directDebitMandateId,
          promotion = maybePromotion
        )
        case p: Paper => PaperEmailFields(
          subscriptionNumber = state.subscriptionNumber,
          fulfilmentOptions = p.fulfilmentOptions,
          productOptions = p.productOptions,
          billingPeriod = p.billingPeriod,
          user = state.user,
          paymentSchedule = state.paymentSchedule,
          firstDeliveryDate = state.firstDeliveryDate,
          currency = p.currency,
          paymentMethod = state.paymentMethod,
          sfContactId = SfContactId(state.salesForceContact.Id),
          directDebitMandateId = directDebitMandateId,
          promotion = maybePromotion,
          state.giftRecipient
        )
        case g: GuardianWeekly =>
          GuardianWeeklyEmailFields(
            subscriptionNumber = state.subscriptionNumber,
            fulfilmentOptions = g.fulfilmentOptions,
            billingPeriod = g.billingPeriod,
            user = state.user,
            paymentSchedule = state.paymentSchedule,
            firstDeliveryDate = state.firstDeliveryDate,
            currency = g.currency,
            paymentMethod = state.paymentMethod,
            sfContactId = SfContactId(state.salesForceContact.Id),
            directDebitMandateId = directDebitMandateId,
            promotion = maybePromotion,
            state.giftRecipient
          )
      }
    )
  }

   private def getAppliedPromotion(
     promotionService: PromotionService,
     maybePromoCode: Option[PromoCode],
     country: Country,
     productRatePlanId: ProductRatePlanId
   ): Option[Promotion] =
    for {
      promoCode <- maybePromoCode
      promotionWithCode <- promotionService.findPromotion(promoCode)
      validPromotion <- promotionService.validatePromotion(promotionWithCode, country, productRatePlanId, isRenewal = false).toOption
    } yield validPromotion.promotion

}
