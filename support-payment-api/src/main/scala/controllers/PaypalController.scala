package controllers

import actions.CorsActionProvider
import cats.implicits._
import backend.{BackendError, PaypalBackend}
import com.typesafe.scalalogging.StrictLogging
import model.{ClientBrowserInfo, DefaultThreadPool, ResultBody}
import model.paypal._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents, Result}
import util.RequestBasedProvider
import ActionOps.Extension

class PaypalController(
    cc: ControllerComponents,
    paypalBackendProvider: RequestBasedProvider[PaypalBackend],
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc)
    with Circe
    with JsonUtils
    with StrictLogging
    with CorsActionProvider {

  import util.RequestTypeDecoder.instances._
  import PaypalJsonDecoder._

  def toErrorResult(error: PaypalApiError): Result = {
    new Status(error.responseCode.getOrElse(INTERNAL_SERVER_ERROR))(ResultBody.Error(error))
  }

  def createPayment: Action[CreatePaypalPaymentData] = CorsAction
    .async(circe.json[CreatePaypalPaymentData]) { createRequest =>
      paypalBackendProvider
        .getInstanceFor(createRequest)
        .createPayment(createRequest.body)
        .subflatMap(PaypalPaymentSuccess.fromPayment)
        .fold(
          err => toErrorResult(err),
          payment => Ok(ResultBody.Success(payment)),
        )
    }
    .withLogging(this.getClass.getCanonicalName, "createPayment")

  def capturePayment(): Action[CapturePaypalPaymentData] = Action
    .async(circe.json[CapturePaypalPaymentData]) { captureRequest =>
      paypalBackendProvider
        .getInstanceFor(captureRequest)
        .capturePayment(
          captureRequest.body,
          ClientBrowserInfo.fromRequest(captureRequest, captureRequest.body.acquisitionData.gaId),
        )
        .fold(
          err => toErrorResult(err),
          _ => Ok(ResultBody.Success(())),
        )
    }
    .withLogging(this.getClass.getCanonicalName, "capturePayment")

  // We return the email that we track the acquisition with so that we can offer the user the chance to sign up
  // to marketing emails with the same email that we associate with the acquisition in our database
  def executePayment: Action[ExecutePaypalPaymentData] = CorsAction
    .async(circe.json[ExecutePaypalPaymentData]) { executeRequest =>
      paypalBackendProvider
        .getInstanceFor(executeRequest)
        .executePayment(
          executeRequest.body,
          ClientBrowserInfo.fromRequest(executeRequest, executeRequest.body.acquisitionData.gaId),
        )
        .fold(
          err => toErrorResult(err),
          payment => Ok(ResultBody.Success(ExecutePaymentResponse(payment.email))),
        )
    }
    .withLogging(this.getClass.getCanonicalName, "executePayment")

  def processRefund: Action[PaypalRefundWebHookBody] = Action
    .async(circe.json[PaypalRefundWebHookBody]) { request =>
      paypalBackendProvider
        .getInstanceFor(request)
        .processRefundHook(PaypalRefundWebHookData.fromRequest(request))
        .fold(
          {
            case err: BackendError.PaypalApiError => toErrorResult(err.error)
            case err: BackendError => InternalServerError(ResultBody.Error(err.getMessage))
          },
          _ => Ok(ResultBody.Success("paypal payment successfully refunded")),
        )
    }
    .withLogging(this.getClass.getCanonicalName, "processRefund")

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls
}
