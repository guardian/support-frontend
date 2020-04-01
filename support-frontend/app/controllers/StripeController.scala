package controllers

import actions.CustomActionBuilders
import com.typesafe.scalalogging.StrictLogging
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents, Result}
import services.{RecaptchaService, StripeSetupIntentService}

import scala.concurrent.{ExecutionContext, Future}


case class SetupIntentRequestRecaptcha(token: String, stripePublicKey: String)
object SetupIntentRequestRecaptcha {
  implicit val decoder: Decoder[SetupIntentRequestRecaptcha] = deriveDecoder
}

class StripeController(
  components: ControllerComponents,
  actionRefiners: CustomActionBuilders,
  recaptchaService: RecaptchaService,
  stripeService: StripeSetupIntentService,
  v2RecaptchaKey: String
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe with StrictLogging {

  import actionRefiners._
  import cats.implicits._
  import cats.data.EitherT

  def createSetupIntentRecaptcha: Action[SetupIntentRequestRecaptcha] = PrivateAction.async(circe.json[SetupIntentRequestRecaptcha]) { implicit request =>
    val token = request.body.token

    val result = for {
      recaptchaResponse <- recaptchaService.verify(token, v2RecaptchaKey)
      response <- if (recaptchaResponse.success) {
        stripeService(request.body.stripePublicKey).map(response => Ok(response))
      } else EitherT[Future,String,Result](Forbidden())
    } yield response

    result.fold(
      error => {
        logger.error(error)
        InternalServerError()
      },
      identity
    )
  }
}
