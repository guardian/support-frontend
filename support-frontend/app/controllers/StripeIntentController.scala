package controllers

import actions.CustomActionBuilders
import com.typesafe.scalalogging.StrictLogging
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.{RecaptchaService, StripeIntentService}

import scala.concurrent.ExecutionContext


case class SetupRequest(token: String, apiKey: String)
object SetupRequest {
  implicit val decoder: Decoder[SetupRequest] = deriveDecoder
}
class StripeIntentController(components: ControllerComponents,
                              actionRefiners: CustomActionBuilders,
                              recaptchaService: RecaptchaService,
                             stripeService: StripeIntentService,
                              v2RecaptchaKey: String)
(implicit ec: ExecutionContext) extends AbstractController(components) with Circe with StrictLogging {

  import actionRefiners._
  import cats.implicits._
  import cats.data.EitherT

  def createSetupIntentRecaptcha: Action[SetupRequest] = PrivateAction.async(circe.json[SetupRequest]) { implicit request =>
    val token = request.body.token

    for {
      recaptchaResponse <- recaptchaService.verify(token, v2RecaptchaKey)
//      isVerified = recaptchaResponse.
    }


//    recaptchaService
//      .verify(token, v2RecaptchaKey
//      .flatMap {
//        recaptchaRes =>
//          if (recaptchaRes)
//           stripeService(request.body.apiKey)
//          else
//            Unauthorized("Recaptcha Failed")
//      }
  }
}
