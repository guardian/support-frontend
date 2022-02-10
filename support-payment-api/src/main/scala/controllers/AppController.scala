package controllers

import actions.CorsActionProvider
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.JsonCodec
import model.DefaultThreadPool
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

@JsonCodec case class HealthCheckResponse(status: String, gitCommitId: String)

class AppController(
    cc: ControllerComponents,
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc)
    with Circe
    with JsonUtils
    with StrictLogging
    with CorsActionProvider {

  def healthcheck: Action[AnyContent] = Action {
    Ok(HealthCheckResponse("Everything is super", app.BuildInfo.gitCommitId))
      .withHeaders("Cache-Control" -> "private, no-store")
  }

  def acquisition(viewId: String, acquisition: String): Action[AnyContent] = Action {
    logger.info(s"Acquisition data. viewId: ${viewId} - acquisition: ${acquisition}")
    Ok("Acquisition received")
  }

  def corsOptions() = CorsAction { request =>
    NoContent.withHeaders("Vary" -> "Origin")
  }

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls

}
