package controllers

import actions.CorsActionProvider
import backend.AmazonPayBackend
import cats.data.EitherT
import com.amazon.pay.response.ipn.model.Notification
import com.typesafe.scalalogging.StrictLogging
import model.amazonpay.BundledAmazonPayRequest.AmazonPayRequest
import model.amazonpay.{AmazonPayApiError}
import model.{ClientBrowserInfo, DefaultThreadPool, ResultBody}
import play.api.libs.circe.Circe
import play.api.mvc._
import util.RequestBasedProvider

import scala.concurrent.Future
import scala.util.Try

class AmazonPayController(
    cc: ControllerComponents,
    amazonBackendProvider: RequestBasedProvider[AmazonPayBackend],
    parseNotification: (Map[String, String], String) => Notification,
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc)
    with Circe
    with JsonUtils
    with StrictLogging
    with CorsActionProvider {

  import util.RequestTypeDecoder.instances._

  def toErrorResult(error: AmazonPayApiError): Result = {
    new Status(error.responseCode.getOrElse(INTERNAL_SERVER_ERROR))(ResultBody.Error(error))
  }

  def executePayment: Action[AmazonPayRequest] = CorsAction.async(circe.json[AmazonPayRequest]) { createRequest =>
    val result = amazonBackendProvider
      .getInstanceFor(createRequest)
      .makePayment(createRequest.body, ClientBrowserInfo.fromRequest(createRequest, None))

    result.fold(
      err => toErrorResult(err),
      res => Ok(ResultBody.Success("ok")),
    )
  }

  private def unmarshalNotification(notificationRequest: Request[AnyContent]) = {
    logger.info(s"notificationbody ${notificationRequest.body}")
    val bodyAsText = notificationRequest.body.asText.getOrElse("")
    logger.info(s"Attempting to parse notification body as json: $bodyAsText")
    val notification = io.circe.parser.parse(bodyAsText.toString).flatMap { json =>
      logger.info(s"Attempting to parse notification request: $json")
      Try(parseNotification(notificationRequest.headers.toSimpleMap, json.toString)).toEither
    }

    EitherT
      .fromEither[Future](notification)
      .leftMap { error =>
        logger.error(s"Failed to parse notification")
        error
      }
  }

  def notification(): Action[AnyContent] = CorsAction.async { notificationRequest =>
    val notification = unmarshalNotification(notificationRequest)

    notification
      .flatMap { n =>
        amazonBackendProvider
          .getInstanceFor(notificationRequest)
          .handleNotification(n)
      }
      .fold(
        err => {
          logger.error(s"Error processing Amazon Pay notification: ${err.getMessage}", err)
          new Status(SERVICE_UNAVAILABLE)(ResultBody.Error("")) // 503 will cause Amazon to retry every hour for 14 days
        },
        _ => new Status(NO_CONTENT)(ResultBody.Success("")),
      )

  }

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls
}
