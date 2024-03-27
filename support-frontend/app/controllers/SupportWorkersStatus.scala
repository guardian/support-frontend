package controllers

import actions.CustomActionBuilders
import cats.instances.future._
import com.gu.monitoring.SafeLogging
import io.circe.syntax._
import lib.PlayImplicits._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.stepfunctions.SupportWorkersClient

import scala.concurrent.ExecutionContext

class SupportWorkersStatus(
    client: SupportWorkersClient,
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
)(implicit val exec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with SafeLogging {
  import actionRefiners._
  def status(jobId: String): Action[AnyContent] = MaybeAuthenticatedActionOnFormSubmission.async { implicit request =>
    client
      .status(jobId, request.uuid)
      .fold(
        { error =>
          logger.error(scrub"Failed to get status of step function execution for job ${jobId} due to $error")
          InternalServerError
        },
        response => Ok(response.asJson),
      )
  }
}
