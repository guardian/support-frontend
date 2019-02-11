package services

import com.netaporter.uri.QueryString
import com.netaporter.uri.Uri.parseQuery
import com.gu.support.config.PayPalConfig
import com.gu.support.touchpoint.TouchpointService
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.ws.{WSClient, WSResponse}
import services.paypal.{PayPalBillingDetails, Token}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class PayPalNvpService(apiConfig: PayPalConfig, wsClient: WSClient) extends TouchpointService {

  val defaultNVPParams = Map(
    "USER" -> apiConfig.user,
    "PWD" -> apiConfig.password,
    "SIGNATURE" -> apiConfig.signature,
    "VERSION" -> apiConfig.NVPVersion
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

  private def extractResponse(response: WSResponse): QueryString = {

    val responseBody = response.body
    val parsedResponse = parseQuery(responseBody)

    logNVPResponse(parsedResponse)
    parsedResponse
  }

  // Takes a series of parameters, send a request to PayPal, returns response.
  private def nvpRequest(params: Map[String, String]) = {

    val allParams = (params ++ defaultNVPParams).mapValues(b => Seq(b))

    wsClient
      .url(apiConfig.url)
      .post(allParams)
      .map(extractResponse)

  }

  // Takes an NVP response and retrieves a given parameter as a string.
  private def retrieveNVPParam(response: QueryString, paramName: String) =
    response.paramMap(paramName).headOption match {
      case None =>
        SafeLogger.warn(s"Parameter $paramName was missing from the NVP response - $response")
        None
      case Some(value) => Some(value)
    }

  def retrieveEmail(baid: String): Future[Option[String]] = {
    val params = Map(
      "METHOD" -> "BillAgreementUpdate",
      "REFERENCEID" -> baid
    )

    for {
      resp <- nvpRequest(params)
    } yield retrieveNVPParam(resp, "EMAIL")
  }

  // Sets up a payment by contacting PayPal and returns the token.
  def retrieveToken(returnUrl: String, cancelUrl: String)(billingDetails: PayPalBillingDetails): Future[Option[String]] = {
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
      "NOSHIPPING" -> "1"
    )

    nvpRequest(paymentParams).map { resp =>
      retrieveNVPParam(resp, "TOKEN")
    }
  }

  // Sends a request to PayPal to create billing agreement and returns BAID.
  def createBillingAgreement(token: Token): Future[Option[String]] = {
    val agreementParams = Map(
      "METHOD" -> "CreateBillingAgreement",
      "TOKEN" -> token.token
    )

    nvpRequest(agreementParams).map { resp =>
      retrieveNVPParam(resp, "BILLINGAGREEMENTID")
    }
  }
}

