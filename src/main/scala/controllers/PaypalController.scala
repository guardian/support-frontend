package controllers

import actions.CorsActionProvider
import cats.implicits._
import backend.{BackendError, PaypalBackend}
import com.typesafe.scalalogging.StrictLogging
import model.{DefaultThreadPool, ResultBody}
import model.paypal._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents, Result}
import util.RequestBasedProvider

class PaypalController(
  cc: ControllerComponents,
  paypalBackendProvider: RequestBasedProvider[PaypalBackend]
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider with RequestSyntax  {

  import util.RequestTypeDecoder.instances._
  import PaypalJsonDecoder._

  def toErrorResult(error: PaypalApiError): Result = {
    new Status(error.responseCode.getOrElse(INTERNAL_SERVER_ERROR))(ResultBody.Error(error))
  }

  def createPayment: Action[CreatePaypalPaymentData] = CorsAction.async(circe.json[CreatePaypalPaymentData]) {
    createRequest =>
      paypalBackendProvider
        .getInstanceFor(createRequest)
        .createPayment(createRequest.body)
        .subflatMap(PaypalPaymentSuccess.fromPayment)
        .fold(
          err => toErrorResult(err),
          payment => Ok(ResultBody.Success(payment))
        )
    }

  def capturePayment(): Action[CapturePaypalPaymentData] = Action.async(circe.json[CapturePaypalPaymentData]) {
    captureRequest =>
      paypalBackendProvider
        .getInstanceFor(captureRequest)
        .capturePayment(captureRequest.body, captureRequest.countrySubdivisionCode)
        .fold(
          err => toErrorResult(err),
          _ => Ok(ResultBody.Success(()))
        )
    }

  def executePayment: Action[ExecutePaypalPaymentData] = CorsAction.async(circe.json[ExecutePaypalPaymentData]) {
    executeRequest =>
      paypalBackendProvider
        .getInstanceFor(executeRequest)
        .executePayment(executeRequest.body, executeRequest.countrySubdivisionCode)
        .fold(
          err => toErrorResult(err),
          payment => Ok(ResultBody.Success("execute payment success"))
        )
      }

  def processRefund: Action[PaypalRefundWebHookBody] = Action.async(circe.json[PaypalRefundWebHookBody]) { request =>
    paypalBackendProvider.getInstanceFor(request)
      .processRefundHook(PaypalRefundWebHookData.fromRequest(request))
      .fold({
          case err: BackendError.PaypalApiError => toErrorResult(err.error)
          case err: BackendError => InternalServerError(ResultBody.Error(err.getMessage))
        },
        _ => Ok(ResultBody.Success("paypal payment successfully refunded"))
      )
  }

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls
}
