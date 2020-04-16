package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{client, createSetupIntentRequest}
import com.gu.support.config.{Stage, StripeConfig}
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
  testStripeConfig: StripeConfig,
  stage: Stage
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe with StrictLogging {

  import actionRefiners._
  import cats.data.EitherT
  import cats.implicits._
  import io.circe.syntax._
  import services.SetupIntent.encoder

  def createSetupIntentRecaptcha: Action[SetupIntentRequestRecaptcha] = PrivateAction.async(circe.json[SetupIntentRequestRecaptcha]) { implicit request =>
    val v2RecaptchaToken = request.body.token

    val cloudwatchEvent = createSetupIntentRequest(stage, "v2Recaptcha")
    AwsCloudWatchMetricPut(client)(cloudwatchEvent)

    val testPublicKeys = Set(testStripeConfig.australiaAccount.publicKey,
      testStripeConfig.defaultAccount.publicKey)

    val verified =
      if (testPublicKeys(request.body.stripePublicKey))
        // Requests against the test account do not require verification
        EitherT.rightT[Future, String](true)
      else
        recaptchaService.verify(v2RecaptchaToken, v2RecaptchaKey).map(_.success)

    val result = for {
      v <- verified
      response <- if (v) {
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
  }

  def createSetupIntentPRB: Action[SetupIntentRequest] = PrivateAction.async(circe.json[SetupIntentRequest]) { implicit request =>

    val cloudwatchEvent = createSetupIntentRequest(stage, "PRB-CSRF-only")
    AwsCloudWatchMetricPut(client)(cloudwatchEvent)

    stripeService(request.body.stripePublicKey).fold(
      error => {
        logger.error(s"Returning status InternalServerError for Create Stripe Intent PRB request because: $error")
        InternalServerError("")
      },
      response => Ok(response.asJson)
    )
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
