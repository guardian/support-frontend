package controllers


import cats.implicits._
import backend.PaypalBackend
import com.typesafe.scalalogging.StrictLogging
import model.{DefaultThreadPool, ResultBody}
import model.paypal.{CreatePaypalPaymentData, PaypalPaymentSuccess}
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider

import scala.concurrent.ExecutionContext

class PaypalController(controllerComponents: ControllerComponents,
    paypalBackendProvider: RequestBasedProvider[PaypalBackend])(implicit pool: DefaultThreadPool) extends AbstractController(controllerComponents) with Circe with JsonUtils with StrictLogging {
  // Other considerations:
  // - CORS
  // - Test users
  // - Remember that API will change: no redirectUrl!

  import util.RequestTypeDecoder.instances._

  def createPayment: Action[CreatePaypalPaymentData] = Action.async(circe.json[CreatePaypalPaymentData]) { request =>
    paypalBackendProvider.getInstanceFor(request).createPayment(request.body).subflatMap(PaypalPaymentSuccess.fromPayment).fold(
      err => InternalServerError(ResultBody.Error(err.message)),
      payment => Ok(ResultBody.Success(payment))
    )
  }

}
