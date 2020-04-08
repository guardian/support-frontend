package controllers

import actions.CustomActionBuilders
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{createSetupIntentRequest, client}
import com.gu.support.config.Stage
import actions.CustomActionBuilders.AuthRequest
import com.gu.monitoring.SafeLogger
import com.typesafe.scalalogging.StrictLogging
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.{IdentityService, RecaptchaService, StripeSetupIntentService}

import scala.concurrent.{ExecutionContext, Future}


case class SetupIntentRequestRecaptcha(token: String, stripePublicKey: String)
object SetupIntentRequestRecaptcha {
  implicit val decoder: Decoder[SetupIntentRequestRecaptcha] = deriveDecoder
}

case class SetupIntentRequest(stripePublicKey: String)
object SetupIntentRequest {
  implicit val decoder: Decoder[SetupIntentRequest] = deriveDecoder
}

class StripeController(
  components: ControllerComponents,
  actionRefiners: CustomActionBuilders,
  recaptchaService: RecaptchaService,
  stripeService: StripeSetupIntentService,
  identityService: IdentityService,
  v2RecaptchaKey: String,
  stage: Stage
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe with StrictLogging {

  import actionRefiners._
  import cats.data.EitherT
  import cats.implicits._
  import io.circe.syntax._
  import services.SetupIntent.encoder

  def createSetupIntentRecaptcha: Action[SetupIntentRequestRecaptcha] = PrivateAction.async(circe.json[SetupIntentRequestRecaptcha]) { implicit request =>
    val v2RecaptchaToken = request.body.token

    val cloudwatchEvent = createSetupIntentRequest(stage, "v2Recaptcha");
    AwsCloudWatchMetricPut(client)(cloudwatchEvent)

    if (v2RecaptchaToken.nonEmpty) {
      val result = for {
        recaptchaResponse <- recaptchaService.verify(v2RecaptchaToken, v2RecaptchaKey)
        response <- if (recaptchaResponse.success) {
          stripeService(request.body.stripePublicKey).map(response => Ok(response.asJson))
        } else {
          logger.warn(s"Returning status Forbidden for Create Stripe Intent Recaptcha request because Recaptcha verification failed")
          EitherT.rightT[Future, String](Forbidden(""))
        }
      } yield response

      result.fold(
        error => {
          logger.error(s"Returning status InternalServerError for Create Stripe Intent Recaptcha request because: $error")
          InternalServerError("")
        },
        identity
      )
    } else {
      logger.warn(s"Returning status BadRequest for Create Stripe Intent Recaptcha request because user provided no one-time-token value")
      Future.successful(BadRequest("reCAPTCHA one-time-token required"))
    }
  }

  def createSetupIntentWithAuth: Action[SetupIntentRequest] =
    authenticatedAction(subscriptionsClientId).async(circe.json[SetupIntentRequest]) {

      val cloudwatchEvent = createSetupIntentRequest(stage, "authorisedEndpoint");
      AwsCloudWatchMetricPut(client)(cloudwatchEvent)

      implicit request: AuthRequest[SetupIntentRequest] =>
        identityService.getUser(request.user.minimalUser).fold(
          error => {
            logger.error(s"createSetupIntentWithAuth returning InternalServerError because: $error")
            Future.successful(InternalServerError)
          },
          user => {
            stripeService(request.body.stripePublicKey).fold(
              error => {
                logger.error(s"createSetupIntentWithAuth returning InternalServerError because: $error")
                InternalServerError("")
              },
              response => Ok(response.asJson)
            )
          }
        ).flatten
    }
}
