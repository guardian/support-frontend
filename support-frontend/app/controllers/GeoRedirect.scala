package controllers

import actions.CustomActionBuilders
import lib.RedirectWithEncodedQueryString
import play.api.mvc.{AbstractController, Action, AnyContent}
import utils.FastlyGEOIP._

trait GeoRedirect {
  self: AbstractController =>
  val actionRefiners: CustomActionBuilders

  import actionRefiners._

  def geoRedirect(path: String): Action[AnyContent] = GeoTargetedCachedAction() { implicit request =>
    val redirectUrl = s"/${request.geoData.countryGroup.map(_.id).getOrElse("int")}/$path"
    RedirectWithEncodedQueryString(redirectUrl, request.queryString, status = FOUND)
  }
}
