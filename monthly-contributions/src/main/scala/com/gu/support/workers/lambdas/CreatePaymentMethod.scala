package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.i18n.{CountryGroup, Currency}
import com.gu.monitoring.products.RecurringContributionsMetrics
import com.gu.paypal.PayPalService
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.StripeService
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.lambdas.PaymentMethodExtensions.PaymentMethodExtension
import com.gu.support.workers.model._
import com.gu.support.workers.model.monthlyContributions.state.{CreatePaymentMethodState, CreateSalesforceContactState}
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.{ExecutionContext, Future}

class CreatePaymentMethod(servicesProvider: ServiceProvider = ServiceProvider)(implicit ec: ExecutionContext)
    extends ServicesHandler[CreatePaymentMethodState, CreateSalesforceContactState](servicesProvider) with LazyLogging {

  def this()(implicit ec: ExecutionContext) = this(ServiceProvider)

  override protected def servicesHandler(state: CreatePaymentMethodState, requestInfo: RequestInfo, context: Context, services: Services) = {
    logger.debug(s"CreatePaymentMethod state: $state")

    for {
      paymentMethod <- createPaymentMethod(state, services)
      _ <- putCloudWatchMetrics(paymentMethod.toFriendlyString)
    } yield HandlerResult(
      getCreateSalesforceContactState(state, paymentMethod),
      requestInfo.appendMessage(s"Payment method is ${paymentMethod.toFriendlyString}")
    )
  }

  private def createPaymentMethod(
    state: CreatePaymentMethodState,
    services: Services
  ) =
    state.paymentFields match {
      case stripe: StripePaymentFields =>
        createStripePaymentMethod(stripe, state.contribution.currency, services.stripeService)
      case paypal: PayPalPaymentFields =>
        createPayPalPaymentMethod(paypal, services.payPalService)
      case dd: DirectDebitPaymentFields =>
        createDirectDebitPaymentMethod(dd, state.user)
    }

  private def getCreateSalesforceContactState(state: CreatePaymentMethodState, paymentMethod: PaymentMethod) =
    CreateSalesforceContactState(
      state.requestId,
      state.user,
      state.contribution,
      paymentMethod,
      state.acquisitionData
    )

  def createStripePaymentMethod(stripe: StripePaymentFields, currency: Currency, stripeService: StripeService): Future[CreditCardReferenceTransaction] =
    stripeService
      .createCustomer(stripe.userId, stripe.stripeToken, currency)
      .map { stripeCustomer =>
        val card = stripeCustomer.source
        CreditCardReferenceTransaction(card.id, stripeCustomer.id, card.last4,
          CountryGroup.countryByCode(card.country), card.exp_month, card.exp_year, card.zuoraCardType)
      }

  def createPayPalPaymentMethod(payPal: PayPalPaymentFields, payPalService: PayPalService): Future[PayPalReferenceTransaction] =
    payPalService
      .retrieveEmail(payPal.baid)
      .map(PayPalReferenceTransaction(payPal.baid, _))

  def createDirectDebitPaymentMethod(dd: DirectDebitPaymentFields, user: User): Future[DirectDebitPaymentMethod] =
    Future.successful(DirectDebitPaymentMethod(
      user.firstName,
      user.lastName,
      dd.accountHolderName,
      dd.sortCode,
      dd.accountNumber,
      user.country
    ))

  def putCloudWatchMetrics(paymentMethod: String): Future[Unit] =
    new RecurringContributionsMetrics(paymentMethod, "monthly")
      .putContributionSignUpStartProcess().recover({ case _ => () })

}
