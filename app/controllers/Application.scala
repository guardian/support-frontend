package controllers

import actions.{ActionRefiners, CachedAction}
import assets.AssetsResolver
import play.api.mvc._
import services.IdentityService

import scala.concurrent.ExecutionContext
import cats.implicits._

class Application(
    implicit
    actionRefiners: ActionRefiners,
    val assets: AssetsResolver,
    identityService: IdentityService,
    ec: ExecutionContext,
    components: ControllerComponents,
    cachedAction: CachedAction
) extends AbstractController(components) {

  import actionRefiners._

  def reactTemplate(title: String, id: String, js: String): Action[AnyContent] = cachedAction {
    Ok(views.html.react(title, id, js))
  }

  def authenticatedReactTemplate(title: String, id: String, js: String): Action[AnyContent] = AuthenticatedAction { request =>
    Ok(views.html.react(title, id, js))
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

}
