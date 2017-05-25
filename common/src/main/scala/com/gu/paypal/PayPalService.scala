package com.gu.paypal

import java.util.NoSuchElementException
import java.util.concurrent.TimeUnit.SECONDS

import com.gu.config.{Configuration, Stages}
import com.gu.okhttp.RequestRunners
import com.netaporter.uri.QueryString
import com.netaporter.uri.Uri.parseQuery
import okhttp3.{FormBody, Request, Response}
import org.slf4j.LoggerFactory

import scala.util.Try

class PayPalService(apiConfig: PayPalConfig) {
  val logger = LoggerFactory.getLogger(this.getClass.getSimpleName)
  val config = apiConfig
  // The parameters sent with every NVP request.
  val defaultNVPParams = Map(
    "USER" -> config.user,
    "PWD" -> config.password,
    "SIGNATURE" -> config.signature,
    "VERSION" -> config.NVPVersion
  )

  // Logs the result of the PayPal NVP request.
  private def logNVPResponse(response: QueryString) = {

    def msg(status: String) = s"PayPal: $status (NVPResponse: $response)"

    retrieveNVPParam(response, "ACK") match {
      case "Success" => logger.info("Successful PayPal NVP request")
      case "SuccessWithWarning" => logger.warn(msg("Warning"))
      case "Failure" => logger.error(msg("Error"))
      case "FailureWithWarning" => logger.error(msg("Error With Warning"))
    }

  }

  // Extracts response params as a map.
  private def extractResponse(response: Response) = {

    val responseBody = response.body().string()

    if (Configuration.stage == Stages.DEV)
      logger.info("NVP response body = " + responseBody)

    val parsedResponse = parseQuery(responseBody)

    logNVPResponse(parsedResponse)
    parsedResponse

  }

  // Takes a series of parameters, send a request to PayPal, returns response.
  private def nvpRequest(params: Map[String, String]) = {

    val reqBody = new FormBody.Builder()
    for ((param, value) <- defaultNVPParams) reqBody.add(param, value)
    for ((param, value) <- params) reqBody.add(param, value)

    val request = new Request.Builder()
      .url(config.url)
      .post(reqBody.build())
      .build()

    extractResponse(RequestRunners.client.newBuilder().readTimeout(30, SECONDS).build().newCall(request).execute)

  }

  // Takes an NVP response and retrieves a given parameter as a string.
  private def retrieveNVPParam(response: QueryString, paramName: String) =
    try {
      response.paramMap(paramName).head
    } catch {
      case _: NoSuchElementException =>
        val errorMessage = Try(response.paramMap("L_LONGMESSAGE0").head).getOrElse(response.toString)
        throw new PayPalError(errorMessage)
    }

  def retrieveEmail(baid: String): String = {
    val params = Map(
      "METHOD" -> "BillAgreementUpdate",
      "REFERENCEID" -> baid
    )

    retrieveNVPParam(nvpRequest(params), "EMAIL")
  }

  // Sets up a payment by contacting PayPal and returns the token.
  def retrieveToken(returnUrl: String, cancelUrl: String)(billingDetails: PayPalBillingDetails): String = {
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
      "NOSHIPPING" -> "1"
    )

    retrieveNVPParam(nvpRequest(paymentParams), "TOKEN")
  }

  // Sends a request to PayPal to create billing agreement and returns BAID.
  def retrieveBaid(token: Token): String = {
    val agreementParams = Map(
      "METHOD" -> "CreateBillingAgreement",
      "TOKEN" -> token.token
    )

    retrieveNVPParam(nvpRequest(agreementParams), "BILLINGAGREEMENTID")
  }

  class PayPalError(message: String) extends Throwable

}
