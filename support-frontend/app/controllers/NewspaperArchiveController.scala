package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import play.api.mvc.Results.Ok
import play.api.mvc.{Action, AnyContent}
import play.twirl.api.Html
import views.html.newspaperArchive

class NewspaperArchiveController(
    actionRefiners: CustomActionBuilders,
    assetsResolver: AssetsResolver,
) {
  import actionRefiners._

  def getHeader: Action[AnyContent] = CachedAction() { implicit request =>
    val htmlElement = assetsResolver.getSsrCacheContentsAsHtml(divId = "content", file = "ssr-holding-content.html")
    Ok(newspaperArchive("Newspaper Archive", htmlElement))
  }
}
