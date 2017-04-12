package controllers

import assets.AssetsResolver
import lib.actions.{CachedAction, PrivateAction}
import play.api.mvc.{Action, AnyContent, Controller}

class Application()(implicit val assets: AssetsResolver) extends Controller {

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
