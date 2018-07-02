package controllers

import actions.CorsActionProvider
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents, Result}
import util.RequestBasedProvider
import backend.StripeBackend
import model.stripe.{StripeApiError, StripeChargeData, StripeRefundHook}
import model.{DefaultThreadPool, ResultBody}

class StripeController(
  cc: ControllerComponents,
  stripeBackendProvider: RequestBasedProvider[StripeBackend],
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
  extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider with RequestSyntax {

  import util.RequestTypeDecoder.instances._
  import model.stripe.StripeJsonDecoder._

  def toErrorResult(error: StripeApiError): Result = {
    new Status(error.responseCode.getOrElse(INTERNAL_SERVER_ERROR))(ResultBody.Error(error))
  }

  def executePayment: Action[StripeChargeData] = CorsAction.async(circe.json[StripeChargeData]) { request => {
      stripeBackendProvider.getInstanceFor(request)
        .createCharge(request.body, request.countrySubdivisionCode)
        .fold(
          err => toErrorResult(err),
          charge => Ok(ResultBody.Success(charge))
        )
      }
    }

  def processRefund: Action[StripeRefundHook] = Action(circe.json[StripeRefundHook]).async { request =>
    stripeBackendProvider.getInstanceFor(request)
      .processRefundHook(request.body)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage)),
        _ => Ok(ResultBody.Success("successfully processed Stripe refund webhook"))
      )
  }

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls

}
