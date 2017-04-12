package controllers

import lib.actions.{CachedAction, PrivateAction}
import play.api.mvc.{Action, AnyContent, Controller}

class Application extends Controller {

  def helloWorld: Action[AnyContent] = CachedAction {
    Ok(views.html.index())
  }

  def bundlesLanding: Action[AnyContent] = CachedAction {
    Ok(views.html.bundlesLanding())
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

}
