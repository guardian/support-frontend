package controllers

import assets.AssetsResolver
import lib.actions.{ActionRefiners, CachedAction}
import play.api.mvc.{Action, AnyContent, Controller}
import services.IdentityService
import scala.concurrent.ExecutionContext
import cats.implicits._

class Application(
    implicit
    actionRefiners: ActionRefiners,
    val assets: AssetsResolver,
    identityService: IdentityService,
    ec: ExecutionContext
) extends Controller {

  import actionRefiners._

  def reactTemplate(title: String, id: String, js: String): Action[AnyContent] = CachedAction {
    Ok(views.html.react(title, id, js))
  }

  def authenticatedReactTemplate(title: String, id: String, js: String): Action[AnyContent] = AuthenticatedAction { request =>
    Ok(views.html.authenticatedReact(title, id, js))
  }

  def authenticatedFullUserReactTemplate(title: String, id: String, js: String): Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    identityService.getUser(request.user).map { user =>
      Ok(views.html.authenticatedFullUserReactTemplate(title, id, js, user))
    } getOrElse InternalServerError
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

}
