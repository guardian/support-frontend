package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import com.gu.i18n.CountryGroup._
import config.StringsConfig
import play.api.mvc._
import utils.RequestCountry._

import scala.concurrent.ExecutionContext

class Subscriptions(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    components: ControllerComponents,
    stringsConfig: StringsConfig
)(implicit val ec: ExecutionContext) extends AbstractController(components) {

  import actionRefiners._

  implicit val ar = assets

  def geoRedirect: Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => "/uk/subscribe"
      case _ => "https://subscribe.theguardian.com"
    }

    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

  def legacyRedirect(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    // Country code is required here because it's a parameter in the route.
    // But we don't actually use it.
    Redirect("https://subscribe.theguardian.com", request.queryString, status = FOUND)
  }

  def landing(title: String, id: String, js: String): Action[AnyContent] = CachedAction() { implicit request =>
    Ok(views.html.main(
      title,
      id,
      js,
      "subscriptionsLandingPageStyles.css",
      description = Some(stringsConfig.subscriptionsLandingDescription)
    ))
  }

  def digital(countryCode: String): Action[AnyContent] = CachedAction() { implicit request =>
    val urlWhenDisabled = s"/$countryCode/subscribe"
    if (request.getQueryString("digiSub").contains("true")) {
      val title = "Support the Guardian | Digital Subscription"
      val id = "digital-subscription-landing-page-" + countryCode
      val js = "digitalSubscriptionLandingPage.js"
      val css = "digitalSubscriptionLandingPageStyles.css"
      Ok(views.html.main(title, id, js, css))
    } else {
      Redirect(urlWhenDisabled)
    }
  }

}
