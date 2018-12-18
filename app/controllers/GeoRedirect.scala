package controllers

import actions.CustomActionBuilders
import com.gu.i18n.CountryGroup._
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import utils.RequestCountry._
abstract class GeoRedirect(components: ControllerComponents, actionRefiners: CustomActionBuilders) extends AbstractController(components) {
  import actionRefiners._

  def geoRedirect(path: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    // If we implement endpoints for EU, CA & NZ we could replace this match with
    // request.fastlyCountry.map(_.id).getOrDefault("int")
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => s"/uk/$path"
      case Some(US) => s"/us/$path"
      case Some(Australia) => s"/au/$path"
      case _ => s"/int/$path"
    }

    Redirect(redirectUrl, request.queryString, status = FOUND)

  }

  def geoRedirectAllMarkets(path: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = request.fastlyCountry match {
      case Some(UK) => s"/uk/$path"
      case Some(US) => s"/us/$path"
      case Some(Australia) => s"/au/$path"
      case Some(Europe) => s"/eu/$path"
      case Some(Canada) => s"/ca/$path"
      case Some(NewZealand) => s"/nz/$path"
      case _ => s"/int/$path"
    }
    Redirect(redirectUrl, request.queryString, status = FOUND)
  }

}
