package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.i18n.{CountryGroup, Currency}
import com.gu.monitoring.SafeLogger
import com.gu.paypal.PayPalService
import com.gu.salesforce.AddressLineTransformer
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.StripeService
import com.gu.stripe.StripeServiceForCurrency._
import com.gu.support.workers._
import com.gu.support.workers.lambdas.PaymentMethodExtensions.PaymentMethodExtension
import com.gu.support.workers.states.{CreatePaymentMethodState, CreateSalesforceContactState, FreeProduct, PaidProduct, PaymentDetails}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreatePaymentMethod(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreatePaymentMethodState, CreateSalesforceContactState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: CreatePaymentMethodState, requestInfo: RequestInfo, context: Context, services: Services): FutureHandlerResult = {
    SafeLogger.debug(s"CreatePaymentMethod state: $state")

    state.paymentFields match {
      case FreeProduct => Future.successful(HandlerResult(
        getCreateSalesforceContactState(state, FreeProduct),
        requestInfo
          .appendMessage(s"No Payment method present")
          .appendMessage(s"Product is ${state.product.describe}")
      ))
      case PaidProduct(paymentFields) => createPaymentMethod(paymentFields, state.user, state.product.currency, services)
        .map(paymentMethod =>
          HandlerResult(
            getCreateSalesforceContactState(state, PaidProduct(paymentMethod)),
            requestInfo
              .appendMessage(s"Payment method is ${paymentMethod.toFriendlyString}")
              .appendMessage(s"Product is ${state.product.describe}")
          ))
    }
  }

  private def createPaymentMethod(
    paymentFields: PaymentFields,
    user:User,
    currency: Currency,
    services: Services
  ): Future[PaymentMethod] =
    paymentFields match {
      case stripe: StripePaymentFields =>
        createStripePaymentMethod(stripe, services.stripeService, currency)
      case paypal: PayPalPaymentFields =>
        createPayPalPaymentMethod(paypal, services.payPalService)
      case dd: DirectDebitPaymentFields =>
        createDirectDebitPaymentMethod(dd, user)
      case _: ExistingPaymentFields =>
        Future.failed(new RuntimeException("Existing payment methods should never make their way to this lambda"))
    }

  private def getCreateSalesforceContactState(state: CreatePaymentMethodState, paymentMethod: PaymentDetails[PaymentMethod]) =
    CreateSalesforceContactState(
      state.requestId,
      state.user,
      state.giftRecipient,
      state.redemptionData,
      state.product,
      paymentMethod,
      state.firstDeliveryDate,
      state.promoCode,
      state.acquisitionData
    )

  def createStripePaymentMethod(
    stripe: StripePaymentFields,
    stripeService: StripeService,
    currency: Currency
  ): Future[CreditCardReferenceTransaction] = {
    val stripeServiceForCurrency = stripeService.withCurrency(currency)
    (stripe match {
      case StripeSourcePaymentFields(source, stripePaymentType) =>
        stripeServiceForCurrency.createCustomerFromToken(source).map { customer =>
          val card = customer.source
          CreditCardReferenceTransaction(
            card.id,
            customer.id,
            card.last4,
            CountryGroup.countryByCode(card.country),
            card.exp_month,
            card.exp_year,
            card.brand.zuoraCreditCardType,
            paymentGateway = chargeGateway(currency),
            stripePaymentType = stripePaymentType
          )
        }
      case StripePaymentMethodPaymentFields(paymentMethod, stripePaymentType) =>
        for {
          stripeCustomer <- stripeServiceForCurrency.createCustomerFromPaymentMethod(paymentMethod)
          stripePaymentMethod <- stripeServiceForCurrency.getPaymentMethod(paymentMethod)
        } yield {
          val card = stripePaymentMethod.card
          CreditCardReferenceTransaction(
            paymentMethod.value,
            stripeCustomer.id,
            card.last4,
            CountryGroup.countryByCode(card.country),
            card.exp_month,
            card.exp_year,
            card.brand.zuoraCreditCardType,
            paymentGateway = paymentIntentGateway(currency),
            stripePaymentType = stripePaymentType
          )
        }
    })
  }

  def createPayPalPaymentMethod(payPal: PayPalPaymentFields, payPalService: PayPalService): Future[PayPalReferenceTransaction] =
    payPalService
      .retrieveEmail(payPal.baid)
      .map(PayPalReferenceTransaction(payPal.baid, _))

  def createDirectDebitPaymentMethod(dd: DirectDebitPaymentFields, user: User): Future[DirectDebitPaymentMethod] = {
    val addressLine = AddressLineTransformer.combinedAddressLine(user.billingAddress.lineOne, user.billingAddress.lineTwo)

    Future.successful(DirectDebitPaymentMethod(
      firstName = user.firstName,
      lastName = user.lastName,
      bankTransferAccountName = dd.accountHolderName,
      bankCode = dd.sortCode,
      bankTransferAccountNumber = dd.accountNumber,
      country = user.billingAddress.country,
      city = user.billingAddress.city,
      postalCode = user.billingAddress.postCode,
      state = user.billingAddress.state,
      streetName = addressLine.map(_.streetName),
      streetNumber = addressLine.flatMap(_.streetNumber)
    ))
  }

}
