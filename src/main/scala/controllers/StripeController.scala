package controllers

import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider

import backend.StripeBackend
import model.stripe.StripeChargeData
import model.{DefaultThreadPool, ResultBody}

class StripeController(
    controllerComponents: ControllerComponents,
    stripeBackendProvider: RequestBasedProvider[StripeBackend]
  )(implicit pool: DefaultThreadPool) extends AbstractController(controllerComponents) with Circe with JsonUtils with StrictLogging {

  import util.RequestTypeDecoder.instances._
  import model.stripe.StripeJsonDecoder._

  def executePayment: Action[StripeChargeData] = Action(circe.json[StripeChargeData]).async { request =>
    {
      stripeBackendProvider.getInstanceFor(request)
        .createCharge(request.body)
        .fold(
          err => InternalServerError(ResultBody.Error(err.getMessage)),
          charge => Ok(ResultBody.Success(charge))
        )
    }
  }
}
