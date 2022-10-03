package controllers

import actions.{CorsActionProvider, RateLimitingAction, RateLimitingSettings}
import backend.StripeBackend
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import controllers.ActionOps.Extension
import model._
import model.stripe.StripePaymentIntentsApiResponse.{requiresActionEncoder, successEncoder}
import model.stripe._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.CloudWatchService
import util.RequestBasedProvider

import scala.concurrent.duration._

class StripeController(
    cc: ControllerComponents,
    stripeBackendProvider: RequestBasedProvider[StripeBackend],
    cloudWatchService: CloudWatchService,
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc)
    with Circe
    with JsonUtils
    with StrictLogging
    with CorsActionProvider {

  import model.CheckoutError.checkoutErrorEncoder
  import model.stripe.StripeJsonDecoder._
  import util.RequestTypeDecoder.instances._

  private val RateLimitingAction = new RateLimitingAction(
    cc.parsers,
    cc.executionContext,
    cloudWatchService,
    RateLimitingSettings(10, 5.hours),
    paymentProvider = PaymentProvider.Stripe,
    stage = RequestEnvironments.stage,
  )

  lazy val CorsAndRateLimitAction = CorsAction andThen RateLimitingAction

  // Stripe Checkout handler, still required for mobile apps payments
  def executePayment: Action[LegacyStripeChargeRequest] = CorsAndRateLimitAction
    .async(circe.json[LegacyStripeChargeRequest]) { request =>
      stripeBackendProvider
        .getInstanceFor(request)
        .createCharge(request.body, ClientBrowserInfo.fromRequest(request, request.body.acquisitionData.gaId))
        .fold(
          err => {
            val errorResponse = CheckoutErrorResponse.fromStripeApiError(err)
            new Status(errorResponse.statusCode)(ResultBody.Error(errorResponse.checkoutError))
          },
          charge => Ok(ResultBody.Success(charge)),
        )
    }
    .withLogging(this.getClass.getCanonicalName, "executePayment")

  def processRefund: Action[StripeRefundHook] = Action(circe.json[StripeRefundHook])
    .async { request =>
      stripeBackendProvider
        .getInstanceFor(request)
        .processRefundHook(request.body)
        .fold(
          err => {
            logger.error(s"Error processing stripe refund: ${err.getMessage}")
            InternalServerError(ResultBody.Error(err.getMessage))
          },
          _ => Ok(ResultBody.Success("successfully processed Stripe refund webhook")),
        )
    }
    .withLogging(this.getClass.getCanonicalName, "processRefund")

  def createPayment: Action[StripePaymentIntentRequest.CreatePaymentIntent] = CorsAndRateLimitAction
    .async(circe.json[StripePaymentIntentRequest.CreatePaymentIntent]) { request =>
      stripeBackendProvider
        .getInstanceFor(request)
        .createPaymentIntent(request.body, ClientBrowserInfo.fromRequest(request, request.body.acquisitionData.gaId))
        .fold(
          err => {
            val errorResponse = CheckoutErrorResponse.fromStripeApiError(err)
            new Status(errorResponse.statusCode)(ResultBody.Error(errorResponse.checkoutError))
          },
          {
            case success: StripePaymentIntentsApiResponse.Success => Ok(ResultBody.Success("ok"))
            case requiresAction: StripePaymentIntentsApiResponse.RequiresAction =>
              Ok(ResultBody.RequiresAction(requiresAction))
          },
        )
    }
    .withLogging(this.getClass.getCanonicalName, "createPayment")

  def confirmPayment: Action[StripePaymentIntentRequest.ConfirmPaymentIntent] = CorsAndRateLimitAction
    .async(circe.json[StripePaymentIntentRequest.ConfirmPaymentIntent]) { request =>
      stripeBackendProvider
        .getInstanceFor(request)
        .confirmPaymentIntent(request.body, ClientBrowserInfo.fromRequest(request, request.body.acquisitionData.gaId))
        .fold(
          err => {
            val errorResponse = CheckoutErrorResponse.fromStripeApiError(err)
            new Status(errorResponse.statusCode)(ResultBody.Error(errorResponse.checkoutError))
          },
          response => Ok(ResultBody.Success(response)),
        )
    }
    .withLogging(this.getClass.getCanonicalName, "confirmPayment")

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls

}
