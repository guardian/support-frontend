package controllers

import cats.implicits._
import backend.PaypalBackend
import com.typesafe.scalalogging.StrictLogging
import model.{DefaultThreadPool, ResultBody}
import model.paypal._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider

import scala.concurrent.Future

class PaypalController(controllerComponents: ControllerComponents,
  paypalBackendProvider: RequestBasedProvider[PaypalBackend], corsUrls: List[String])(implicit pool: DefaultThreadPool) extends AbstractController(controllerComponents) with Circe with JsonUtils with StrictLogging {

  import util.RequestTypeDecoder.instances._
  import PaypalJsonDecoder._

  def corsOptions() = Action { request =>
    NoContent.withHeaders(("Vary" -> "Origin") :: CorsControllerHelper.corsHeaders(request, corsUrls): _*)
  }

  def createPayment: Action[CreatePaypalPaymentData] = Action.async(circe.json[CreatePaypalPaymentData]) { createRequest =>
    paypalBackendProvider
      .getInstanceFor(createRequest)
      .createPayment(createRequest.body)
      .subflatMap(PaypalPaymentSuccess.fromPayment)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage))
          .withHeaders(CorsControllerHelper.corsHeaders(createRequest, corsUrls): _*),
        payment => Ok(ResultBody.Success(payment))
          .withHeaders(CorsControllerHelper.corsHeaders(createRequest, corsUrls): _*)
      )
  }

  def capturePayment(): Action[CapturePaypalPaymentData] = Action.async(circe.json[CapturePaypalPaymentData]) { captureRequest =>
    paypalBackendProvider
      .getInstanceFor(captureRequest)
      .capturePayment(captureRequest.body)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage)),
        _ => Ok(ResultBody.Success(()))
      )
  }

  def executePayment: Action[ExecutePaypalPaymentData] = Action.async(circe.json[ExecutePaypalPaymentData]) { executeRequest =>
    paypalBackendProvider
      .getInstanceFor(executeRequest)
      .executePayment(executeRequest.body)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage))
          .withHeaders(CorsControllerHelper.corsHeaders(executeRequest, corsUrls): _*),
        payment => Ok(ResultBody.Success("execute payment success"))
          .withHeaders(CorsControllerHelper.corsHeaders(executeRequest, corsUrls): _*)
      )
  }

  def hook: Action[String] = Action.async(parse.tolerantText) { paypalHookRequest =>
    import io.circe.parser._
    import util.RequestTypeDecoder.hook._
    val paypalHookJson = paypalHookRequest.body
    decode[PaypalHook](paypalHookJson)
      .fold(
        err => Future.successful(BadRequest(ResultBody.Error(err.getMessage))),
        paypalHook => {
          paypalBackendProvider
            .getInstanceFor(paypalHook)
            .processPaymentHook(paypalHook, paypalHookRequest.headers.toSimpleMap, paypalHookJson)
            .fold(
              err => InternalServerError(ResultBody.Error(err.message)),
              _ => Ok(ResultBody.Success("execute hook success"))
            )
        }
      )
  }
}
