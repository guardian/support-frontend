package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.gocardless.GoCardlessWorkersService
import com.gu.i18n.{Country, CountryGroup}
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers._
import com.gu.support.workers.lambdas.PaymentMethodExtensions.PaymentMethodExtension
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{ContributionState, SupporterPlusState}
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, PreparePaymentMethodForReuseState}
import com.gu.support.zuora.api.PaymentGateway
import com.gu.support.zuora.api.response.{
  GetPaymentMethodCardReferenceResponse,
  GetPaymentMethodDirectDebitResponse,
  GetPaymentMethodResponse,
}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

class PreparePaymentMethodForReuse(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[PreparePaymentMethodForReuseState, CreateZuoraSubscriptionState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
      state: PreparePaymentMethodForReuseState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ) = {

    import com.gu.WithLoggingSugar._

    val zuoraService = services.zuoraService
    val accountId = state.paymentFields.billingAccountId
    for {
      account <- zuoraService.getAccount(accountId).withEventualLogging(s"getObjectAccount($accountId)")
      accountIdentityId <- getOrFailWithMessage(
        account.basicInfo.IdentityId__c,
        s"Zuora account $accountId has no identityId",
      )
      _ <- ifFalseReturnError(
        accountIdentityId == state.user.id,
        s"Zuora account $accountId identity id: $accountIdentityId does not match ${state.user.id}",
      )
      paymentId <- getOrFailWithMessage(
        account.billingAndPayment.defaultPaymentMethodId,
        s"Zuora account $accountId has no default payment method",
      )
      getPaymentMethodResponse <- zuoraService
        .getPaymentMethod(paymentId)
        .withEventualLogging(s"getPaymentMethod($paymentId)")
      _ <- ifFalseReturnError(
        getPaymentMethodResponse.paymentMethodStatus == "Active",
        s"Zuora account $accountId has a non active default payment method",
      )
      sfContactId <- getOrFailWithMessage(
        account.basicInfo.sfContactId__c,
        s"Zuora account $accountId has no sfContact",
      )
      paymentMethod <- toPaymentMethod(
        getPaymentMethodResponse,
        services.goCardlessService,
        account.billingAndPayment.paymentGateway,
      )
      sfContact = SalesforceContactRecord(sfContactId, account.basicInfo.crmId)
      (productState, productType) <- Future.fromTry(state.product match {
        case c: Contribution =>
          Success(
            (
              ContributionState(
                product = c,
                paymentMethod = paymentMethod,
                salesForceContact = sfContact,
              ),
            ),
            c,
          )
        case sp: SupporterPlus =>
          Success(
            (
              SupporterPlusState(
                product = sp,
                paymentMethod = paymentMethod,
                promoCode = state.promoCode,
                appliedPromotion = state.appliedPromotion,
                salesForceContact = sfContact,
                billingCountry = state.user.billingAddress.country,
              ),
            ),
            sp,
          )
        case _ =>
          Failure(
            new RuntimeException(
              "Reusing payment methods is not yet supported for products other than contributions or SupporterPlus",
            ),
          )
      })
    } yield HandlerResult(
      CreateZuoraSubscriptionState(
        productSpecificState = productState,
        requestId = state.requestId,
        user = state.user,
        product = productType,
        analyticsInfo = state.analyticsInfo,
        firstDeliveryDate = None,
        promoCode = state.promoCode,
        appliedPromotion = state.appliedPromotion,
        csrUsername = None,
        salesforceCaseId = None,
        acquisitionData = state.acquisitionData,
      ),
      requestInfo
        .appendMessage(s"Payment method is ${paymentMethod.toFriendlyString}")
        .appendMessage(s"Product is ${state.product.describe}"),
    )
  }

  def toPaymentMethod(
      getPaymentMethodResponse: GetPaymentMethodResponse,
      goCardlessService: GoCardlessWorkersService,
      paymentGateway: PaymentGateway,
  ): Future[PaymentMethod] = getPaymentMethodResponse match {

    case cardResponse: GetPaymentMethodCardReferenceResponse =>
      val maybeCountry: Option[Country] =
        cardResponse.creditCardCountry.flatMap(CountryGroup.byOptimisticCountryNameOrCode)
      Future.successful(
        CreditCardReferenceTransaction(
          TokenId = cardResponse.tokenId,
          SecondTokenId = cardResponse.secondTokenId,
          CreditCardNumber = cardResponse.creditCardMaskNumber,
          CreditCardCountry = maybeCountry,
          CreditCardExpirationMonth = cardResponse.creditCardExpirationMonth,
          CreditCardExpirationYear = cardResponse.creditCardExpirationYear,
          CreditCardType = cardResponse.creditCardType,
          PaymentGateway = paymentGateway,
          StripePaymentType = None,
        ),
      )
    case directDebitResponse: GetPaymentMethodDirectDebitResponse =>
      cloneMandate(directDebitResponse, goCardlessService)
    case other =>
      errorResponse(s"unsupported payment method: '$other'")

  }

  def cloneMandate(
      existingDirectDebit: GetPaymentMethodDirectDebitResponse,
      goCardlessService: GoCardlessWorkersService,
  ): Future[ClonedDirectDebitPaymentMethod] = for {
    customerBankAccountId <- goCardlessService.getCustomerAccountIdFromMandateId(existingDirectDebit.tokenId)
    clonedMandateRefs <- goCardlessService.createNewMandateOnExistingCustomerAccount(customerBankAccountId)
  } yield ClonedDirectDebitPaymentMethod(
    TokenId = clonedMandateRefs.mandateId, // yes Zuora put the mandateId into tokenId
    MandateId = clonedMandateRefs.reference, // and yes Zuora like to use the 'reference' in the 'mandateId' field, sigh
    FirstName = existingDirectDebit.firstName,
    LastName = existingDirectDebit.lastName,
    BankTransferAccountName = existingDirectDebit.bankTransferAccountName,
    BankTransferAccountNumber = existingDirectDebit.bankTransferAccountNumberMask,
    BankCode = existingDirectDebit.bankCode,
  )

  def errorResponse(msg: String): Future[Nothing] = Future.failed(new Exception(msg))

  def ifFalseReturnError(condition: Boolean, falseResponse: String): Future[Unit] =
    if (condition) Future.successful(()) else errorResponse(falseResponse)

  def getOrFailWithMessage[T](option: Option[T], message: String): Future[T] = option match {
    case None => errorResponse(message)
    case Some(value) => Future.successful(value)
  }

}
