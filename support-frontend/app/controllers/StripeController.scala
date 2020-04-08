package controllers

import actions.CustomActionBuilders
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{createSetupIntentRequest, client}
import com.gu.support.config.Stage
import com.typesafe.scalalogging.StrictLogging
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.{RecaptchaService, StripeSetupIntentService}

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

  def createSetupIntent: Action[SetupIntentRequest] = PrivateAction.async(circe.json[SetupIntentRequest]) { implicit request =>

    val cloudwatchEvent = createSetupIntentRequest(stage, "CSRF-only");
    AwsCloudWatchMetricPut(client)(cloudwatchEvent)

    stripeService(request.body.stripePublicKey).fold(
      error => {
        logger.error(s"Returning status InternalServerError for Create Stripe Intent request because: $error")
        InternalServerError("")
      },
      response => Ok(response.asJson)
    )
  }
}
