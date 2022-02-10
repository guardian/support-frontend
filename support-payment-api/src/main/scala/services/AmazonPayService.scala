package services

import java.util.UUID

import cats.implicits._
import com.amazon.pay.impl.PayConfig
import com.amazon.pay.request._
import com.amazon.pay.response.model.{AuthorizationDetails, OrderReferenceDetails}
import com.amazon.pay.response.parser.{CloseOrderReferenceResponseData, ConfirmOrderReferenceResponseData}
import com.amazon.pay.types.{CurrencyCode, Region}
import com.typesafe.scalalogging.StrictLogging
import conf.AmazonPayConfig
import model.amazonpay._
import model.{Currency, DefaultThreadPool}
import services.AmazonPayService.CurrencyNotFoundException

/*
Based on the sample implementation found here
https://github.com/amzn/amazon-pay-sdk-java#one-time-transaction-api-flow

 */
class AmazonPayService(config: AmazonPayConfig)(implicit pool: DefaultThreadPool) extends StrictLogging {

  val copyForEmail =
    "Thank you for making a contribution. Your support helps protect the Guardian’s independence and means we can keep delivering quality journalism that’s open for all."

  val storeName = "The Guardian"

  val clientConfig = new PayConfig()
    .withSellerId(config.merchantId)
    .withAccessKey(config.accessKey)
    .withSecretKey(config.secretKey)
    .withSandboxMode(config.sandboxMode)
    .withRegion(Region.US) // todo: This will need to be dynamic

  import com.amazon.pay.impl.PayClient

  val client = new PayClient(clientConfig)

  def getOrderReference(orderReferenceId: String) = {
    Either
      .catchNonFatal {
        client.getOrderReferenceDetails(new GetOrderReferenceDetailsRequest(orderReferenceId)).getDetails
      }
      .leftMap { error =>
        AmazonPayApiError.fromString(error.getMessage)
      }
  }

  def cancelOrderReference(orderRef: OrderReferenceDetails) = {
    Either
      .catchNonFatal {
        client.cancelOrderReference(new CancelOrderReferenceRequest(orderRef.getAmazonOrderReferenceId))
      }
      .leftMap { error =>
        AmazonPayApiError.fromString(error.getMessage)
      }
  }

  def setOrderReference(payment: AmazonPaymentData): Either[AmazonPayApiError, OrderReferenceDetails] = {
    logger.info("Setting order ref: " + payment.orderReferenceId)
    Either
      .catchNonFatal {

        val currencyCode = payment.currency match {
          case Currency.USD => CurrencyCode.USD // todo: This will need to be dynamic -make sure to update clientConfig
          case _ => throw CurrencyNotFoundException(s"currency ${payment.currency} currently not supported")
        }

        val req = new SetOrderReferenceDetailsRequest(payment.orderReferenceId, payment.amount.toString())
          .setSellerId(config.merchantId)
          .setOrderCurrencyCode(currencyCode)
          .setMWSAuthToken(config.accessKey)
          .setStoreName(storeName)
          .setSellerOrderId(validUUID)

        client.setOrderReferenceDetails(req).getDetails

      }
      .leftMap { error =>
        AmazonPayApiError.fromString(error.getMessage)
      }
  }

  def confirmOrderReference(
      orderRef: OrderReferenceDetails,
  ): Either[AmazonPayApiError, ConfirmOrderReferenceResponseData] = {
    Either
      .catchNonFatal {
        client.confirmOrderReference(new ConfirmOrderReferenceRequest(orderRef.getAmazonOrderReferenceId))
      }
      .leftMap { error =>
        AmazonPayApiError.fromString(error.getMessage)
      }
  }

  def authorize(
      orderReference: OrderReferenceDetails,
      paymentData: AmazonPaymentData,
  ): Either[AmazonPayApiError, AuthorizationDetails] = {
    logger.info("Authorizing order ref: " + paymentData.orderReferenceId)

    Either
      .catchNonFatal {
        val authorizeRequest =
          new AuthorizeRequest(orderReference.getAmazonOrderReferenceId, validUUID, paymentData.amount.toString)

        authorizeRequest
          .setAuthorizationCurrencyCode(CurrencyCode.USD) // Overrides currency code set in Client
          .setTransactionTimeout("0") // Set to 0 for synchronous mode
          .setSellerAuthorizationNote(copyForEmail)
          .setCaptureNow(true) // Set this to true if you want to capture the amount in the same API call

        logger.info(authorizeRequest.toString)

        val res = client.authorize(authorizeRequest)

        val resState = res.getDetails.getAuthorizationStatus
        logger.info(
          s"${orderReference.getAmazonOrderReferenceId} Auth call response: ${resState.getState} ${resState.getReasonCode} ${resState.getReasonDescription}",
        )
        res.getDetails

      }
      .leftMap { error =>
        AmazonPayApiError.fromString(error.getMessage)
      }
  }

  def close(payment: AmazonPaymentData): Either[AmazonPayApiError, CloseOrderReferenceResponseData] = {
    logger.info(s"Closing ${payment.orderReferenceId}")
    Either
      .catchNonFatal {
        client.closeOrderReference(new CloseOrderReferenceRequest(payment.orderReferenceId))
      }
      .leftMap { error =>
        AmazonPayApiError.fromString(error.getMessage)
      }
  }

  private def validUUID = UUID.randomUUID().toString.filterNot(_ == '-').take(32) // must be 32 or less
}

object AmazonPayService {

  case class CurrencyNotFoundException(message: String) extends Exception {
    override def getMessage: String = message
  }

  def fromAmazonPayConfig(config: AmazonPayConfig)(implicit pool: DefaultThreadPool): AmazonPayService =
    new AmazonPayService(config)

}
