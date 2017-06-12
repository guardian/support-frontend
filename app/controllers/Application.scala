package controllers

import assets.AssetsResolver
import lib.actions.{ActionRefiners, CachedAction}
import play.api.mvc.{Action, AnyContent, Controller}

class Application(implicit actionRefiners: ActionRefiners, val assets: AssetsResolver) extends Controller {

  import actionRefiners._

  def reactTemplate(title: String, id: String, js: String): Action[AnyContent] = CachedAction {
    Ok(views.html.react(title, id, js))
  }

  def authenticatedReactTemplate(title: String, id: String, js: String): Action[AnyContent] = AuthenticatedAction { request =>
    Ok(views.html.authenticatedReact(title, id, js, request.user.user))
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

}
