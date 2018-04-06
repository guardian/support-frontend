package controllers

import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.JsonCodec
import model.DefaultThreadPool
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

@JsonCodec case class HealthCheckResponse(status: String, gitCommitId: String)

class AppController(
  controllerComponents: ControllerComponents
)(implicit pool: DefaultThreadPool, val corsUrls: List[String])
  extends AbstractController(controllerComponents) with Circe with JsonUtils with StrictLogging {

  def healthcheck: Action[AnyContent] = Action {
    Ok(HealthCheckResponse("Everything is super", app.BuildInfo.gitCommitId))
  }

  def acquisition(viewId: String, acquisition: String): Action[AnyContent] = Action {
    logger.info(s"Acquisition data. viewId: ${viewId} - acquisition: ${acquisition}")
    Ok("Acquisition received ")
  }

  def corsOptions() = Action { request =>
    NoContent.withHeaders("Vary" -> "Origin")
  }

}