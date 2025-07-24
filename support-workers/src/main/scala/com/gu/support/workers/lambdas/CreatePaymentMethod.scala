package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricSetup.stripeHostedFormFieldsHashMismatch
import com.gu.config.Configuration
import com.gu.i18n.CountryGroup
import com.gu.paypal.PayPalService
import com.gu.salesforce.AddressLineTransformer
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.{RetrieveCheckoutSessionResponseSuccess, StripeService}
import com.gu.support.catalog.Sunday
import com.gu.support.workers._
import com.gu.support.workers.lambdas.PaymentMethodExtensions.PaymentMethodExtension
import com.gu.support.workers.states.{CreatePaymentMethodState, CreateSalesforceContactState}
import com.gu.support.zuora.api.{DirectDebitGateway, DirectDebitTortoiseMediaGateway, PaymentGateway}

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
    createPaymentMethod(
      state,
      services,
    )
      .map(paymentMethod =>
        HandlerResult(
          getCreateSalesforceContactState(state, paymentMethod),
          requestInfo
            .appendMessage(s"Payment method is ${paymentMethod.toFriendlyString}")
            .appendMessage(s"Product is ${state.product.describe}"),
        ),
      )
  }

  private def createPaymentMethod(
      state: CreatePaymentMethodState,
      services: Services,
  ): Future[PaymentMethod] =
    state.paymentFields match {
      case stripeHosted: StripeHostedPaymentFields =>
        createStripeHostedPaymentMethod(stripeHosted, services.stripeService, state.user)
      case stripe: StripePaymentFields =>
        createStripePaymentMethod(stripe, services.stripeService)
      case paypal: PayPalPaymentFields =>
        createPayPalPaymentMethod(paypal, services.payPalService)
      case dd: DirectDebitPaymentFields =>
        createDirectDebitPaymentMethod(dd, state)
      case sepa: SepaPaymentFields =>
        createSepaPaymentMethod(sepa, state.user, state.ipAddress, state.userAgent)
    }

  private def getCreateSalesforceContactState(
      state: CreatePaymentMethodState,
      paymentMethod: PaymentMethod,
  ) =
    CreateSalesforceContactState(
      state.requestId,
      state.user,
      state.giftRecipient,
      state.product,
      state.analyticsInfo,
      paymentMethod,
      state.firstDeliveryDate,
      state.appliedPromotion,
      state.csrUsername,
      state.salesforceCaseId,
      state.acquisitionData,
      state.similarProductsConsent,
    )

  private def optionToFuture[T](option: Option[T], errorMessage: String): Future[T] = {
    option match {
      case Some(value) => Future.successful(value)
      case None => Future.failed(new RuntimeException(errorMessage))
    }
  }

  private def booleanToFuture(boolean: Boolean, errorMessage: String) =
    if (boolean) Future.successful(()) else Future.failed(new RuntimeException(errorMessage))

  private def doesCheckoutSessionFormFieldsHashMatch(
      user: User,
      checkoutSession: RetrieveCheckoutSessionResponseSuccess,
  ): Boolean = {
    val expectedFormFieldsHash = FormFieldsHash.create(
      email = user.primaryEmailAddress,
      firstName = user.firstName,
      lastName = user.lastName,
      telephoneNumber = user.telephoneNumber,
      billingAddress = user.billingAddress,
      deliveryAddress = user.deliveryAddress,
      deliveryInstructions = user.deliveryInstructions,
    )
    logger.info(
      s"Comparing got: ${checkoutSession.metadata.get(FormFieldsHash.fieldName)} with expected: $expectedFormFieldsHash",
    )
    val hashesDidMatch = checkoutSession.metadata.get(FormFieldsHash.fieldName) == Some(expectedFormFieldsHash)

    if (!hashesDidMatch) {
      val cloudwatchEvent = stripeHostedFormFieldsHashMismatch(Configuration.stage)
      AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
    }

    hashesDidMatch
  }

  private def createStripeHostedPaymentMethod(
      stripeHosted: StripeHostedPaymentFields,
      stripeService: StripeService,
      user: User,
  ) = {
    val stripeServiceForAccount = stripeService.withPublicKey(stripeHosted.stripePublicKey)
    for {
      checkoutSessionId <- optionToFuture(
        stripeHosted.checkoutSessionId,
        "Missing checkout session id",
      )
      checkoutSession <- stripeServiceForAccount
        .retrieveCheckoutSession(checkoutSessionId)
      _ <- booleanToFuture(
        doesCheckoutSessionFormFieldsHashMatch(user, checkoutSession),
        "Checkout session formFields hash does not match",
      )
      paymentMethodId <- optionToFuture(
        PaymentMethodId(checkoutSession.setup_intent.payment_method.id),
        "Invalid PaymentMethodId",
      )
      stripeCustomer <- stripeServiceForAccount.createCustomerFromPaymentMethod(paymentMethodId)
    } yield {
      CreditCardReferenceTransaction(
        paymentMethodId.value,
        stripeCustomer.id,
        PaymentGateway = stripeServiceForAccount.paymentIntentGateway,
        StripePaymentType = None,
      )
    }
  }

  def createStripePaymentMethod(
      stripe: StripePaymentFields,
      stripeService: StripeService,
  ): Future[CreditCardReferenceTransaction] = {
    val stripeServiceForAccount = stripeService.withPublicKey(stripe.stripePublicKey)

    for {
      stripeCustomer <- stripeServiceForAccount.createCustomerFromPaymentMethod(stripe.paymentMethod)
    } yield {
      CreditCardReferenceTransaction(
        stripe.paymentMethod.value,
        stripeCustomer.id,
        PaymentGateway = stripeServiceForAccount.paymentIntentGateway,
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

  def createDirectDebitPaymentMethod(
      dd: DirectDebitPaymentFields,
      state: CreatePaymentMethodState,
  ): Future[DirectDebitPaymentMethod] = {
    import state.user

    val paymentGateway = state.product match {
      case paper: Paper if paper.productOptions == Sunday => DirectDebitTortoiseMediaGateway
      case _ => DirectDebitGateway
    }
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
        PaymentGateway = paymentGateway,
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
}
