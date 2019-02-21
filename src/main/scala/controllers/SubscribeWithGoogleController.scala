package controllers

import actions.CorsActionProvider
import backend.SubscribeWithGoogleBackend
import com.typesafe.scalalogging.StrictLogging
import model.{AcquisitionData, ClientBrowserInfo, DefaultThreadPool, PaymentStatus}
import model.subscribewithgoogle.GoogleRecordPayment
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider
import util.RequestTypeDecoder.instances._

import scala.concurrent.Future

class SubscribeWithGoogleController(
                          cc: ControllerComponents,
                          subscribeWithGoogleBackendProvider: RequestBasedProvider[SubscribeWithGoogleBackend]
                        )(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider {

  override implicit val corsUrls: List[String] = allowedCorsUrls
  override implicit val controllerComponents: ControllerComponents = cc


  def recordPayment: Action[GoogleRecordPayment] = CorsAction.async(circe.json[GoogleRecordPayment]) { request =>
    val requestBody: GoogleRecordPayment = request.body

    requestBody.status match {
      case PaymentStatus.Paid =>
        subscribeWithGoogleBackendProvider.getInstanceFor(request)
          .recordPayment(request.body,
            AcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
            ClientBrowserInfo("localhost", "whoknowsyet", None, "127.0.0.1", None)
          ) //todo: Ophan stats capture as part of future work
        Future.successful(Ok("{}"))
      case PaymentStatus.Failed | PaymentStatus.Refunded =>
        logger.error(
         s"Received $requestBody - as a payment but has a Payment Status of ${requestBody.status} - this is not a payment"
        )
        Future.successful(BadRequest())
    }
  }

  def refundPayment: Action[GoogleRecordPayment] = CorsAction.async(circe.json[GoogleRecordPayment]) { request =>
    val requestBody: GoogleRecordPayment = request.body

    requestBody.status match {
      case PaymentStatus.Refunded =>
        subscribeWithGoogleBackendProvider.getInstanceFor(request)
          .recordRefund(requestBody)
        Future.successful(Ok("{}"))
      case PaymentStatus.Failed | PaymentStatus.Paid =>
        logger.error(
          s"Received $requestBody - for refund but has a Payment Status of ${requestBody.status} - this is not a refund"
        )
        Future.successful(BadRequest())
    }
  }
}
