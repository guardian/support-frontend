package controllers

import assets.AssetsResolver
import lib.actions.{CachedAction, PrivateAction}
import play.api.mvc.{Action, AnyContent, Controller}

class Application()(implicit val assets: AssetsResolver) extends Controller {

  def reactTemplate(title: String, id: String, js: String): Action[AnyContent] = CachedAction {
    Ok(views.html.react(title, id, js))
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

}
