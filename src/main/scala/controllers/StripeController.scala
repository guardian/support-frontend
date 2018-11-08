package controllers

import actions.CorsActionProvider
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider
import backend.StripeBackend
import model.stripe.{StripeChargeData, StripeRefundHook}
import model.{CheckoutErrorResponse, ClientBrowserInfo, DefaultThreadPool, ResultBody}

class StripeController(
  cc: ControllerComponents,
  stripeBackendProvider: RequestBasedProvider[StripeBackend],
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
  extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider {

  import util.RequestTypeDecoder.instances._
  import model.stripe.StripeJsonDecoder._
  import model.CheckoutError.checkoutErrorEncoder

  def executePayment: Action[StripeChargeData] = CorsAction.async(circe.json[StripeChargeData]) { request => {
      stripeBackendProvider.getInstanceFor(request)
        .createCharge(request.body, ClientBrowserInfo.fromRequest(request, request.body.acquisitionData.gaId))
        .fold(
          err => {
            val errorResponse = CheckoutErrorResponse.fromStripeApiError(err)
            new Status(errorResponse.statusCode)(ResultBody.Error(errorResponse.checkoutError))
          },
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
