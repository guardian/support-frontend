package controllers

import actions.CustomActionBuilders

import com.gu.tip.Tip
import play.api.libs.circe.Circe
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class ProdMonitoring(
    actionBuilders: CustomActionBuilders,
    components: ControllerComponents,
    tipMonitoring: Tip
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionBuilders._

  def handleTipRequest(country: String, contributionType: String, paymentMethod: String): Action[AnyContent] =
    maybeAuthenticatedAction().async {
      implicit request =>
        {
          sendTip(country, contributionType, paymentMethod)
          Future(Ok("Payment success received"))
        }
    }

  private def sendTip(country: String, paymentType: String, paymentMethod: String): Unit = {
    tipMonitoring.verify(country + " " + paymentType + " " + paymentMethod + " contribution")
  }

}
