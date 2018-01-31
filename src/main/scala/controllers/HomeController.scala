package controllers

import play.api.mvc.{AbstractController, ControllerComponents}

class HomeController(controllerComponents: ControllerComponents) extends AbstractController(controllerComponents) {
  def index() = Action {
    Ok("hey")
  }
}
