package controllers

import com.typesafe.scalalogging.StrictLogging
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

class AppController(
  controllerComponents: ControllerComponents
) extends AbstractController(controllerComponents) with StrictLogging {

  def healthcheck: Action[AnyContent] = Action {
    Ok("Everything is super")
  }

  def acquisition(viewId: String, acquisition: String): Action[AnyContent] = Action {
    logger.info(s"Acquisition data. viewId: ${viewId} - acquisition: ${acquisition}")
    Ok("Acquisition received ")
  }
}