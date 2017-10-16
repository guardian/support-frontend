package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import play.api.mvc._
import services.IdentityService

import scala.concurrent.ExecutionContext

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    identityService: IdentityService,
    components: ControllerComponents,
    contributionsPayPalEndpoint: String
)(implicit val ec: ExecutionContext) extends AbstractController(components) {

  import actionRefiners._

  implicit val ar = assets
  def contributionsRedirect(): Action[AnyContent] = CachedAction() {
    Ok(views.html.contributionsRedirect())
  }

  def indexRedirect: Action[AnyContent] = Action { implicit request =>
    Redirect("/uk", request.queryString)
  }

  def contributionsLanding(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.contributionsLanding(title, id, js, contributionsPayPalEndpoint))
  }

  def reactTemplate(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.react(title, id, js))
  }

  def authenticatedReactTemplate(title: String, id: String, js: String): Action[AnyContent] = AuthenticatedAction { implicit request =>
    Ok(views.html.react(title, id, js))
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

}
