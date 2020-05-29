package controllers

import actions.CustomActionBuilders
import com.gu.support.config.{Stage, TouchPointEnvironments}
import com.gu.support.redemption.Redemption.{RedemptionCode, validateCode}
import com.gu.support.redemption.{Redemption, RedemptionServiceProvider}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

class RedemptionsController(
  val actionRefiners: CustomActionBuilders,
  components: ControllerComponents,
  stage: Stage
)(implicit val ec: ExecutionContext) extends AbstractController(components){
  import actionRefiners._

  def validate(redemptionCode: String, isTestUser: Option[Boolean]): Action[AnyContent] = NoCacheAction().async { implicit request =>
    val dynamoClient = RedemptionServiceProvider(TouchPointEnvironments.fromStage(stage, isTestUser.getOrElse(false)))
    val codeToCheck = RedemptionCode(redemptionCode)
    val out: Future[Either[validateCode.RedemptonInvalid, Unit]] = Redemption.validateCode(codeToCheck)(dynamoClient)
    out.map(_.left.map(reason => NotFound(reason.clientCode)))
      .map(_.fold(identity, _ => Ok("")))
  }

}
