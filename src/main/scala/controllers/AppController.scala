package controllers

import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

class AppController(
  controllerComponents: ControllerComponents
) extends AbstractController(controllerComponents) {

  def healthcheck: Action[AnyContent] = Action {
    Ok("healthy")
  }

}