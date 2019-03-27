package com.gu.support.workers.lambdas

import java.util.UUID

import com.amazonaws.services.lambda.runtime.Context
import com.gu.i18n.{Country, CountryGroup}
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers._
import com.gu.support.workers.states.{GetPaymentMethodState, CreateZuoraSubscriptionState}
import com.gu.support.zuora.api.response.{GetPaymentMethodCardReferenceResponse, GetPaymentMethodResponse}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class GetPaymentMethod(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[GetPaymentMethodState, CreateZuoraSubscriptionState](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: GetPaymentMethodState, requestInfo: RequestInfo, context: Context, services: Services) = {

    val zuoraService = services.zuoraService
    for {
      account <- zuoraService.getObjectAccount(state.paymentFields.billingAccountId)
      paymentId <- getOrFailWithMessage(account.DefaultPaymentMethodId, "Account has no default payment method")
      getPaymentMethodResponse <- zuoraService.getPaymentMethod(paymentId)
      _ <- ifFalseReturnError(getPaymentMethodResponse.paymentMethodStatus == "Active", "Account has a non active default payment method")
      sfContactId <- getOrFailWithMessage(account.sfContactId__c, "account has no sfContact!")
      paymentMethod <- asFuture(toPaymentMethod(getPaymentMethodResponse))
      sfContact = SalesforceContactRecord(sfContactId, account.CrmId)
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

  def toPaymentMethod(getPaymentMethodResponse: GetPaymentMethodResponse): Either[String, CreditCardReferenceTransaction] = getPaymentMethodResponse match {

    case cardResponse: GetPaymentMethodCardReferenceResponse => {
      val maybeCountry: Option[Country] = cardResponse.creditCardCountry.flatMap(CountryGroup.byOptimisticCountryNameOrCode(_))
      Right(
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
    case other => Left(s"unsupported payment method: '$other'")

  }

  def errorResponse(msg:String): Future[Nothing] = Future.failed(new Exception(msg))

  def ifFalseReturnError(condition: Boolean, falseResponse:String): Future[Unit] = if(condition) Future.successful(()) else errorResponse(falseResponse)

  def getOrFailWithMessage[T](option:Option[T], message: String): Future[T] = option match {
    case None => errorResponse(message)
    case Some(value) => Future.successful(value)
  }

  def asFuture[R](either:Either[String,R]): Future[R] = either match {
    case Left(errorMessage) => errorResponse(errorMessage)
    case Right(successValue) => Future.successful(successValue)
  }

}
