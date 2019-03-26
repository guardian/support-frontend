package com.gu.support.workers.lambdas

import java.util.UUID

import com.amazonaws.services.lambda.runtime.Context
import com.gu.i18n.{Country, CountryGroup}
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers._
import com.gu.support.workers.states.{ClonePaymentMethodState, CreateZuoraSubscriptionState}
import com.gu.support.zuora.api.response.{GetPaymentMethodCardReferenceResponse, GetPaymentMethodDirectDebitResponse, GetPaymentMethodResponse}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class GetPaymentMethod(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[ClonePaymentMethodState, CreateZuoraSubscriptionState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: ClonePaymentMethodState, requestInfo: RequestInfo, context: Context, services: Services) = {

    val zuoraService = services.zuoraService
    for {
      //todo verify all these validations (taken from new product api)
      account <- zuoraService.getObjectAccount(state.paymentFields.billingAccountId)
      paymentId <- getOrFailWithMessage(account.DefaultPaymentMethodId, "Account has no default payment method")
      getPaymentMethodResponse <- zuoraService.getPaymentMethod(paymentId)
      _ <- ifFalseReturnError(getPaymentMethodResponse.paymentMethodStatus == "Active", "Account has a non active default payment method")
      sfContactId <- getOrFailWithMessage(account.sfContactId__c, "account has no sfContact!") //todo should we reuse this or use the create sfContact lambda ?
      paymentMethod <-toPaymentMethod(getPaymentMethodResponse)
      sfContact = SalesforceContactRecord(sfContactId, account.CrmId.getOrElse("")) //todo what is this account id in the salesforceContactRecord ?
    } yield  HandlerResult(
        CreateZuoraSubscriptionState(
          requestId = UUID.randomUUID(),
          user = state.user,
          product = state.product,
          paymentMethod =  paymentMethod,
          firstDeliveryDate = None,
          promoCode = None,
          salesForceContact = sfContact,
          acquisitionData = state.acquisitionData
        ),
        requestInfo
      )
  }

  def toPaymentMethod(getPaymentMethodResponse: GetPaymentMethodResponse): Future[CreditCardReferenceTransaction] = getPaymentMethodResponse match {

    case cardResponse: GetPaymentMethodCardReferenceResponse => {
      //todo check if this conversion is good enough
      val maybeCountry: Option[Country] = cardResponse.creditCardCountry.flatMap(CountryGroup.byOptimisticCountryNameOrCode(_))
      Future.successful(
        CreditCardReferenceTransaction(
          tokenId = cardResponse.tokenId,
          secondTokenId = cardResponse.secondTokenId,
          creditCardNumber = cardResponse.creditCardMaskNumber,
          creditCardCountry = maybeCountry,
          creditCardExpirationMonth = cardResponse.creditCardExpirationMonth,
          creditCardExpirationYear = cardResponse.creditCardExpirationYear,
          creditCardType = cardResponse.creditCardType
        )
      )
    }
    //TODO case dd: GetPaymentMethodDirectDebitResponse =>  /
    //TODO case "PayPal"
    //TODO case "CreditCard" ?

    case other => errorResponse(s"unsupported payment method: '$other'")

  }

  def errorResponse(msg:String): Future[Nothing] = Future.failed(new Exception(msg))
  def ifFalseReturnError(condition: Boolean, falseResponse:String): Future[Unit] = if(condition) Future.successful(()) else errorResponse(falseResponse)
  def getOrFailWithMessage[T](option:Option[T], message: String): Future[T] = option.map(Future.successful(_)).getOrElse(errorResponse(message))


}
