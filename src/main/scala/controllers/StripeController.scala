package controllers

import actions.CorsActionProvider
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.circe.Circe
import play.api.mvc._
import util.RequestBasedProvider
import backend.StripeBackend
import model.stripe.{LegacyStripeChargeRequest, StripePaymentIntentRequest, StripePaymentIntentsApiResponse, StripeRefundHook}
import model.stripe.StripePaymentIntentsApiResponse.{successEncoder, requiresActionEncoder}
import model.{CheckoutErrorResponse, ClientBrowserInfo, DefaultThreadPool, ResultBody}
import ActionOps.Extension

class StripeController(
  cc: ControllerComponents,
  stripeBackendProvider: RequestBasedProvider[StripeBackend],
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
  extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider {

  import util.RequestTypeDecoder.instances._
  import model.stripe.StripeJsonDecoder._
  import model.CheckoutError.checkoutErrorEncoder

  def executePayment: Action[LegacyStripeChargeRequest] = CorsAction.async(circe.json[LegacyStripeChargeRequest]) { request => {
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
    }.withLogging(this.getClass.getCanonicalName, "executePayment")

  def processRefund: Action[StripeRefundHook] = Action(circe.json[StripeRefundHook]).async { request =>
    stripeBackendProvider.getInstanceFor(request)
      .processRefundHook(request.body)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage)),
        _ => Ok(ResultBody.Success("successfully processed Stripe refund webhook"))
      )
  }.withLogging(this.getClass.getCanonicalName, "processRefund")

  def createPayment: Action[StripePaymentIntentRequest.CreatePaymentIntent] = CorsAction.async(circe.json[StripePaymentIntentRequest.CreatePaymentIntent]) { request =>
    stripeBackendProvider.getInstanceFor(request)
      .createPaymentIntent(request.body, ClientBrowserInfo.fromRequest(request, request.body.acquisitionData.gaId))
      .fold(
        err => {
          val errorResponse = CheckoutErrorResponse.fromStripeApiError(err)
          new Status(errorResponse.statusCode)(ResultBody.Error(errorResponse.checkoutError))
        },
        {
          case success: StripePaymentIntentsApiResponse.Success => Ok(ResultBody.Success(success))
          case requiresAction: StripePaymentIntentsApiResponse.RequiresAction => Ok(ResultBody.RequiresAction(requiresAction))
        }
      )
  }

  def confirmPayment: Action[StripePaymentIntentRequest.ConfirmPaymentIntent] = CorsAction.async(circe.json[StripePaymentIntentRequest.ConfirmPaymentIntent]) { request =>
    stripeBackendProvider.getInstanceFor(request)
      .confirmPaymentIntent(request.body, ClientBrowserInfo.fromRequest(request, request.body.acquisitionData.gaId))
      .fold(
        err => {
          val errorResponse = CheckoutErrorResponse.fromStripeApiError(err)
          new Status(errorResponse.statusCode)(ResultBody.Error(errorResponse.checkoutError))
        },
        response => Ok(ResultBody.Success(response))
      )
  }

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls

}
