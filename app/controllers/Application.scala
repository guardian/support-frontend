package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.i18n.CountryGroup._
import play.api.mvc._
import services.IdentityService
import utils.RequestCountry._

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

  def geoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>

    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => "/uk"
      case Some(US) => "/us"
      case _ => "https://membership.theguardian.com/supporter"
    }

    Redirect(redirectUrl, request.queryString)
  }

  def redirect(location: String): Action[AnyContent] = CachedAction() { implicit request =>
    Redirect(location, request.queryString)
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
