package controllers

import actions.CustomActionBuilders
import com.gu.support.config.{Stage, TouchPointEnvironments}
import com.gu.support.redemption.{GetCodeStatus, RedemptionCode, RedemptionTable}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

class RedemptionsController(
  val actionRefiners: CustomActionBuilders,
  components: ControllerComponents,
  stage: Stage
)(implicit val ec: ExecutionContext) extends AbstractController(components){
  import actionRefiners._

  def status(redemptionCode: String, isTestUser: Option[Boolean]): Action[AnyContent] = NoCacheAction().async { implicit request =>
    val getCodeStatus = {
      val shouldTreatAsTestUser = isTestUser.getOrElse(false)
      val touchPointEnvironment = TouchPointEnvironments.fromStage(stage, shouldTreatAsTestUser)
      val dynamoTableAsync = RedemptionTable.forEnvAsync(touchPointEnvironment)
      GetCodeStatus.withDynamoLookup(dynamoTableAsync)
    }

    val codeToCheck = RedemptionCode(redemptionCode)

    val status: Future[Either[GetCodeStatus.RedemptonInvalid, Unit]] = getCodeStatus(codeToCheck)

    status.map {
      case Left(reason) => NotFound(reason.clientCode)
      case Right(()) => Ok("")
    }
  }

}
