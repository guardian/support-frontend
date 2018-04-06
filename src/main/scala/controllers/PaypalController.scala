package controllers

import actions.CorsActionProvider
import cats.implicits._
import backend.PaypalBackend
import com.typesafe.scalalogging.StrictLogging
import model.{DefaultThreadPool, ResultBody}
import model.paypal._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider

import scala.concurrent.Future

class PaypalController(
  cc: ControllerComponents,
  paypalBackendProvider: RequestBasedProvider[PaypalBackend]
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider {

  import util.RequestTypeDecoder.instances._
  import PaypalJsonDecoder._

  def createPayment: Action[CreatePaypalPaymentData] = CorsAction.async(circe.json[CreatePaypalPaymentData]) {
    createRequest =>
      paypalBackendProvider
        .getInstanceFor(createRequest)
        .createPayment(createRequest.body)
        .subflatMap(PaypalPaymentSuccess.fromPayment)
        .fold(
          err => InternalServerError(ResultBody.Error(err.getMessage)),
          payment => Ok(ResultBody.Success(payment))
        )
    }

  def capturePayment(): Action[CapturePaypalPaymentData] = Action.async(circe.json[CapturePaypalPaymentData]) {
    captureRequest =>
      paypalBackendProvider
        .getInstanceFor(captureRequest)
        .capturePayment(captureRequest.body)
        .fold(
          err => InternalServerError(ResultBody.Error(err.getMessage)),
          _ => Ok(ResultBody.Success(()))
        )
    }

  def executePayment: Action[ExecutePaypalPaymentData] = CorsAction.async(circe.json[ExecutePaypalPaymentData]) {
    executeRequest =>
      paypalBackendProvider
        .getInstanceFor(executeRequest)
        .executePayment(executeRequest.body)
        .fold(
          err => InternalServerError(ResultBody.Error(err.getMessage)),
          payment => Ok(ResultBody.Success("execute payment success"))
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


  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls
}