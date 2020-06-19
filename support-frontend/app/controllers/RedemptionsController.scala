package controllers

import actions.CustomActionBuilders
import cats.data.EitherT
import com.gu.support.config.{Stage, TouchPointEnvironments}
import com.gu.support.redemption.{GetCodeStatus, RedemptionTable}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import cats.implicits._
import com.gu.support.redemptions.RedemptionCode

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

    val status: EitherT[Future, String, Unit] =
      for {
        codeToCheck <- EitherT.fromEither[Future](codeToCheck)
        _ <- EitherT(getCodeStatus(codeToCheck)).leftMap(_.clientCode)
      } yield ()

    status.value.map {
      case Left(reason) => NotFound(reason)
      case Right(_) => Ok("")
    }
  }

}
