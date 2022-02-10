package services

import cats.data.OptionT
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.config.PayPalConfig
import com.gu.support.touchpoint.TouchpointService
import io.lemonlabs.uri.QueryString
import io.lemonlabs.uri.parsing.UrlParser.parseQuery
import play.api.libs.ws.{WSClient, WSResponse}
import services.paypal.{PayPalBillingDetails, PayPalCheckoutDetails, PayPalUserDetails, Token}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.Try

class PayPalNvpService(apiConfig: PayPalConfig, wsClient: WSClient) extends TouchpointService {

  val defaultNVPParams = Map(
    "USER" -> apiConfig.user,
    "PWD" -> apiConfig.password,
    "SIGNATURE" -> apiConfig.signature,
    "VERSION" -> apiConfig.NVPVersion,
  )

  private def logNVPResponse(response: QueryString) = {

    val msg = s"NVPResponse: $response"

    retrieveNVPParam(response, "ACK") match {
      case Some("Success") => SafeLogger.info("Successful PayPal NVP request")
      case Some("SuccessWithWarning") => SafeLogger.warn(s"Response (with warning) from PayPal was: $msg")
      case Some("Failure") => SafeLogger.error(scrub"Failure response from PayPal was: $msg")
      case Some("FailureWithWarning") => SafeLogger.error(scrub"Response from PayPal was: $msg")
      case _ => SafeLogger.warn("No ACK parameter was present in the response")
    }

  }

  private def extractResponse(response: WSResponse): Try[QueryString] = {

    val responseBody = response.body
    val parsedResponse = parseQuery(responseBody)

    parsedResponse.foreach(logNVPResponse)
    parsedResponse
  }

  // Takes a series of parameters, send a request to PayPal, returns response.
  private def nvpRequest(params: Map[String, String]) = {

    val allParams = (params ++ defaultNVPParams).view.mapValues(b => Seq(b)).toMap

    wsClient
      .url(apiConfig.url)
      .post(allParams)
      .flatMap(response => Future.fromTry(extractResponse(response)))

  }

  // Takes an NVP response and retrieves a given parameter as a string.
  private def retrieveNVPParam(response: QueryString, paramName: String) =
    response.paramMap.getOrElse(paramName, Nil).headOption match {
      case None =>
        SafeLogger.warn(s"Parameter $paramName was missing from the NVP response - $response")
        None
      case Some(value) => Some(value)
    }

  def retrieveEmail(baid: String): Future[Option[String]] = {
    val params = Map(
      "METHOD" -> "BillAgreementUpdate",
      "REFERENCEID" -> baid,
    )

    for {
      resp <- nvpRequest(params)
    } yield retrieveNVPParam(resp, "EMAIL")
  }

  // Sets up a payment by contacting PayPal and returns the token.
  def retrieveToken(returnUrl: String, cancelUrl: String)(
      billingDetails: PayPalBillingDetails,
  ): Future[Option[String]] = {
    val noShipping = if (billingDetails.requireShippingAddress) "0" else "1"
    val paymentParams = Map(
      "METHOD" -> "SetExpressCheckout",
      "PAYMENTREQUEST_0_PAYMENTACTION" -> "SALE",
      "L_PAYMENTREQUEST_0_NAME0" -> s"Guardian ${billingDetails.billingPeriod.capitalize} Contributor",
      "L_PAYMENTREQUEST_0_DESC0" -> s"You have chosen to pay ${billingDetails.billingPeriod}",
      "L_PAYMENTREQUEST_0_AMT0" -> billingDetails.amount.toString,
      "PAYMENTREQUEST_0_AMT" -> billingDetails.amount.toString,
      "PAYMENTREQUEST_0_CURRENCYCODE" -> billingDetails.currency.toString,
      "RETURNURL" -> returnUrl,
      "CANCELURL" -> cancelUrl,
      "BILLINGTYPE" -> "MerchantInitiatedBilling",
      "NOSHIPPING" -> noShipping,
    )

    nvpRequest(paymentParams).map { resp =>
      retrieveNVPParam(resp, "TOKEN")
    }
  }

  // Sets up a payment by contacting PayPal and also fetches the users details.
  def createAgreementAndRetrieveUser(token: Token): Future[Option[PayPalCheckoutDetails]] =
    for {
      maybeBaid <- createBillingAgreement(token)
      maybeUserDetails <- retrieveUserInformation(token)
    } yield maybeBaid.map(baid => PayPalCheckoutDetails(baid, maybeUserDetails))

  def retrieveUserInformation(token: Token): Future[Option[PayPalUserDetails]] = {
    val paymentParams = Map(
      "METHOD" -> "GetExpressCheckoutDetails",
      "TOKEN" -> token.token,
    )

    nvpRequest(paymentParams).map { resp =>
      for {
        firstName <- retrieveNVPParam(resp, "FIRSTNAME")
        lastName <- retrieveNVPParam(resp, "LASTNAME")
        email <- retrieveNVPParam(resp, "EMAIL")
        shipToStreet <- retrieveNVPParam(resp, "PAYMENTREQUEST_0_SHIPTOSTREET")
        shipToCity <- retrieveNVPParam(resp, "PAYMENTREQUEST_0_SHIPTOCITY")
        shipToState = retrieveNVPParam(resp, "PAYMENTREQUEST_0_SHIPTOSTATE") // State/County may not be present
        shipToZip <- retrieveNVPParam(resp, "PAYMENTREQUEST_0_SHIPTOZIP")
        shipToCountryCode <- retrieveNVPParam(resp, "PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE")
      } yield PayPalUserDetails(
        firstName,
        lastName,
        email,
        shipToStreet,
        shipToCity,
        shipToState,
        shipToZip,
        shipToCountryCode,
      )
    }
  }

  // Sends a request to PayPal to create billing agreement and returns BAID.
  def createBillingAgreement(token: Token): Future[Option[String]] = {
    val agreementParams = Map(
      "METHOD" -> "CreateBillingAgreement",
      "TOKEN" -> token.token,
    )

    nvpRequest(agreementParams).map { resp =>
      retrieveNVPParam(resp, "BILLINGAGREEMENTID")
    }
  }
}
