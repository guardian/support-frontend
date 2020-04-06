package controllers

import actions.CustomActionBuilders
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
  v2RecaptchaKey: String
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe with StrictLogging {

  import actionRefiners._
  import cats.data.EitherT
  import cats.implicits._
  import io.circe.syntax._
  import services.SetupIntent.encoder

  def createSetupIntentRecaptcha: Action[SetupIntentRequestRecaptcha] = PrivateAction.async(circe.json[SetupIntentRequestRecaptcha]) { implicit request =>
    val token = request.body.token

    val result = for {
      recaptchaResponse <- recaptchaService.verify(token, v2RecaptchaKey)
      response <- if (recaptchaResponse.success) {
        stripeService(request.body.stripePublicKey).map(response => Ok(response.asJson))
      } else {
        logger.info(s"Returning status Forbidden for Stripe Intent request because Recaptcha verification failed")
        EitherT.rightT[Future, String](Forbidden(""))
      }
    } yield response

    result.fold(
      error => {
        logger.error(error)
        InternalServerError("")
      },
      identity
    )
  }

  def createSetupIntent: Action[SetupIntentRequest] = PrivateAction.async(circe.json[SetupIntentRequest]) { implicit request =>
    stripeService(request.body.stripePublicKey).fold(
      error => {
        logger.error(error)
        InternalServerError("")
      },
      response => Ok(response.asJson)
    )
  }
}
