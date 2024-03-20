package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.i18n.{CountryGroup, Currency}
import com.gu.monitoring.SafeLogger
import com.gu.paypal.PayPalService
import com.gu.salesforce.AddressLineTransformer
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.StripeService
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers._
import com.gu.support.workers.lambdas.PaymentMethodExtensions.PaymentMethodExtension
import com.gu.support.workers.states.{CreatePaymentMethodState, CreateSalesforceContactState}
import com.gu.support.zuora.api.AmazonPayGatewayUSA

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreatePaymentMethod(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreatePaymentMethodState, CreateSalesforceContactState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
      state: CreatePaymentMethodState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ): FutureHandlerResult = {
    logger.debug(s"CreatePaymentMethod state: $state")

    state.paymentFields fold (
      paymentFields =>
        createPaymentMethod(
          paymentFields,
          state.user,
          state.product.currency,
          services,
          state.ipAddress,
          state.userAgent,
        )
          .map(paymentMethod =>
            HandlerResult(
              getCreateSalesforceContactState(state, Left(paymentMethod)),
              requestInfo
                .appendMessage(s"Payment method is ${paymentMethod.toFriendlyString}")
                .appendMessage(s"Product is ${state.product.describe}"),
            ),
          ),
      redemptionData =>
        Future.successful(
          HandlerResult(
            getCreateSalesforceContactState(state, Right(redemptionData)),
            requestInfo
              .appendMessage(s"Product redemption has no payment method")
              .appendMessage(s"Product is ${state.product.describe}"),
          ),
        )
    )
  }

  private def createPaymentMethod(
      paymentFields: PaymentFields,
      user: User,
      currency: Currency,
      services: Services,
      ipAddress: String,
      userAgent: String,
  ): Future[PaymentMethod] =
    paymentFields match {
      case stripe: StripePaymentFields =>
        createStripePaymentMethod(stripe, services.stripeService, currency)
      case paypal: PayPalPaymentFields =>
        createPayPalPaymentMethod(paypal, services.payPalService)
      case dd: DirectDebitPaymentFields =>
        createDirectDebitPaymentMethod(dd, user)
      case sepa: SepaPaymentFields =>
        createSepaPaymentMethod(sepa, user, ipAddress, userAgent)
      case _: ExistingPaymentFields =>
        Future.failed(new RuntimeException("Existing payment methods should never make their way to this lambda"))
      case amazonPay: AmazonPayPaymentFields =>
        createAmazonPayPaymentMethod(amazonPay, user)
    }

  private def getCreateSalesforceContactState(
      state: CreatePaymentMethodState,
      paymentMethod: Either[PaymentMethod, RedemptionData],
  ) =
    CreateSalesforceContactState(
      state.requestId,
      state.user,
      state.giftRecipient,
      state.product,
      state.analyticsInfo,
      paymentMethod,
      state.firstDeliveryDate,
      state.promoCode,
      state.csrUsername,
      state.salesforceCaseId,
      state.acquisitionData,
    )

  def createStripePaymentMethod(
      stripe: StripePaymentFields,
      stripeService: StripeService,
      currency: Currency,
  ): Future[CreditCardReferenceTransaction] = {
    val stripeServiceForCurrency = {
      stripe.stripePublicKey match {
        case Some(stripePublicKey) => stripeService.withPublicKey(stripePublicKey)
        case None => stripeService.withCurrency(currency)
      }

    }

    for {
      stripeCustomer <- stripeServiceForCurrency.createCustomerFromPaymentMethod(stripe.paymentMethod)
      stripePaymentMethod <- stripeServiceForCurrency.getPaymentMethod(stripe.paymentMethod)
    } yield {
      val card = stripePaymentMethod.card
      CreditCardReferenceTransaction(
        stripe.paymentMethod.value,
        stripeCustomer.id,
        card.last4,
        CountryGroup.countryByCode(card.country),
        card.exp_month,
        card.exp_year,
        card.brand.zuoraCreditCardType,
        PaymentGateway = stripeServiceForCurrency.paymentIntentGateway,
        StripePaymentType = stripe.stripePaymentType,
      )
    }

  }

  def createPayPalPaymentMethod(
      payPal: PayPalPaymentFields,
      payPalService: PayPalService,
  ): Future[PayPalReferenceTransaction] =
    payPalService
      .retrieveEmail(payPal.baid)
      .map(PayPalReferenceTransaction(payPal.baid, _))

  def createDirectDebitPaymentMethod(dd: DirectDebitPaymentFields, user: User): Future[DirectDebitPaymentMethod] = {
    val addressLine =
      AddressLineTransformer.combinedAddressLine(user.billingAddress.lineOne, user.billingAddress.lineTwo)

    Future.successful(
      DirectDebitPaymentMethod(
        FirstName = user.firstName,
        LastName = user.lastName,
        BankTransferAccountName = dd.accountHolderName,
        BankCode = dd.sortCode,
        BankTransferAccountNumber = dd.accountNumber,
        Country = user.billingAddress.country,
        City = user.billingAddress.city,
        PostalCode = user.billingAddress.postCode,
        State = user.billingAddress.state,
        StreetName = addressLine.map(_.streetName),
        StreetNumber = addressLine.flatMap(_.streetNumber),
      ),
    )
  }

  def createSepaPaymentMethod(
      sepa: SepaPaymentFields,
      user: User,
      ipAddress: String,
      userAgent: String,
  ): Future[SepaPaymentMethod] = {
    if (ipAddress.length() > 15) {
      logger.warn(s"IPv6 Address: ${ipAddress} is longer than 15 characters")
    }
    if (userAgent.length() > 255) {
      logger.warn(s"User Agent: ${userAgent} will be truncated to 255 characters")
    }
    Future.successful(
      SepaPaymentMethod(
        BankTransferAccountName = sepa.accountHolderName,
        BankTransferAccountNumber = sepa.iban,
        Country = sepa.country,
        StreetName = sepa.streetName,
        Email = user.primaryEmailAddress,
        IPAddress = ipAddress,
        GatewayOptionData = GatewayOptionData(
          List(
            GatewayOption(
              "UserAgent",
              userAgent.take(255), // zuora's max length for GatewayOption values
            ),
          ),
        ),
      ),
    )
  }

  def createAmazonPayPaymentMethod(amazonPay: AmazonPayPaymentFields, user: User): Future[AmazonPayPaymentMethod] =
    Future.successful(
      AmazonPayPaymentMethod(
        TokenId = amazonPay.amazonPayBillingAgreementId,
        PaymentGateway = AmazonPayGatewayUSA,
      ),
    )
}
