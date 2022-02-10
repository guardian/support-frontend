package com.gu.paypal

import java.util.NoSuchElementException

import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.config.{PayPalConfig, Stages}
import io.lemonlabs.uri.QueryString
import io.lemonlabs.uri.parsing.UrlParser.parseQuery
import okhttp3.{FormBody, Request, Response}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.Try

class PayPalService(apiConfig: PayPalConfig, client: FutureHttpClient) {

  val config = apiConfig
  // The parameters sent with every NVP request.
  val defaultNVPParams = Map(
    "USER" -> config.user,
    "PWD" -> config.password,
    "SIGNATURE" -> config.signature,
    "VERSION" -> config.NVPVersion,
  )

  // Logs the result of the PayPal NVP request.
  private def logNVPResponse(response: QueryString) = {

    def msg(status: String) = s"PayPal: $status (NVPResponse: $response)"

    retrieveNVPParam(response, "ACK") match {
      case "Success" => SafeLogger.info("Successful PayPal NVP request")
      case "SuccessWithWarning" => SafeLogger.warn(msg("Warning"))
      case "Failure" => SafeLogger.warn(msg("Error"))
      case "FailureWithWarning" => SafeLogger.warn(msg("Error With Warning"))
    }

  }

  // Extracts response params as a map.
  private def extractResponse(response: Response) = {
    val responseBody = response.body().string()

    if (!response.isSuccessful)
      throw PayPalError(response.code(), responseBody)

    if (Configuration.stage == Stages.DEV)
      SafeLogger.info("NVP response body = " + responseBody)

    val parsedResponse = parseQuery(responseBody)

    parsedResponse.map(logNVPResponse)
    parsedResponse

  }

  // Takes a series of parameters, send a request to PayPal, returns response.
  private def nvpRequest(params: Map[String, String]): Future[QueryString] = {

    val reqBody = new FormBody.Builder()
    for ((param, value) <- defaultNVPParams) reqBody.add(param, value)
    for ((param, value) <- params) reqBody.add(param, value)

    val request = new Request.Builder()
      .url(config.url)
      .post(reqBody.build())
      .build()

    client.apply(request).flatMap(response => Future.fromTry(extractResponse(response)))
  }

  // Takes an NVP response and retrieves a given parameter as a string.
  private def retrieveNVPParam(response: QueryString, paramName: String) =
    try {
      response.paramMap(paramName).head
    } catch {
      case _: NoSuchElementException =>
        val errorMessage = Try(response.paramMap("L_LONGMESSAGE0").head).getOrElse(response.toString)
        throw PayPalError(200, errorMessage) // If we got to here the original response was successful
    }

  def retrieveEmail(baid: String): Future[String] = {
    val params = Map(
      "METHOD" -> "BillAgreementUpdate",
      "REFERENCEID" -> baid,
    )

    nvpRequest(params).map(retrieveNVPParam(_, "EMAIL"))
  }

  // Sets up a payment by contacting PayPal and returns the token.
  def retrieveToken(returnUrl: String, cancelUrl: String)(billingDetails: PayPalBillingDetails): Future[String] = {
    val paymentParams = Map(
      "METHOD" -> "SetExpressCheckout",
      "PAYMENTREQUEST_0_PAYMENTACTION" -> "SALE",
      "L_PAYMENTREQUEST_0_NAME0" -> s"Guardian ${billingDetails.tier.capitalize}",
      "L_PAYMENTREQUEST_0_DESC0" -> s"You have chosen the ${billingDetails.billingPeriod} payment option",
      "L_PAYMENTREQUEST_0_AMT0" -> s"${billingDetails.amount}",
      "PAYMENTREQUEST_0_AMT" -> s"${billingDetails.amount}",
      "PAYMENTREQUEST_0_CURRENCYCODE" -> s"${billingDetails.currency}",
      "RETURNURL" -> returnUrl,
      "CANCELURL" -> cancelUrl,
      "BILLINGTYPE" -> "MerchantInitiatedBilling",
      "NOSHIPPING" -> "1",
    )

    nvpRequest(paymentParams).map(retrieveNVPParam(_, "TOKEN"))
  }

  // Sends a request to PayPal to create billing agreement and returns BAID.
  def retrieveBaid(token: Token): Future[String] = {
    val agreementParams = Map(
      "METHOD" -> "CreateBillingAgreement",
      "TOKEN" -> token.token,
    )

    nvpRequest(agreementParams).map(retrieveNVPParam(_, "BILLINGAGREEMENTID"))
  }

}
