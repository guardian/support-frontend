package controllers

import actions.CorsActionProvider
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider
import backend.StripeBackend
import model.stripe.{StripeChargeData, StripeHook}
import model.{DefaultThreadPool, ResultBody}

class StripeController(
  cc: ControllerComponents,
  stripeBackendProvider: RequestBasedProvider[StripeBackend],
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
  extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider {

  import util.RequestTypeDecoder.instances._
  import model.stripe.StripeJsonDecoder._

  def executePayment: Action[StripeChargeData] = CorsAction.async(circe.json[StripeChargeData]) { request => {
      stripeBackendProvider.getInstanceFor(request)
        .createCharge(request.body)
        .fold(
          err => InternalServerError(ResultBody.Error(err.getMessage)),
          charge => Ok(ResultBody.Success(charge))
        )
      }
    }

  def hook: Action[StripeHook] = Action(circe.json[StripeHook]).async { request =>
    stripeBackendProvider.getInstanceFor(request)
      .processPaymentHook(request.body)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage)),
        _ => Ok(ResultBody.Success("execute hook success"))
      )
  }

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls

}
