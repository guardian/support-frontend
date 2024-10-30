package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import play.api.mvc.Results.{InternalServerError, Ok}
import play.api.mvc.{Action, AnyContent}
import play.twirl.api.Html
import views.{EmptyDiv, SSRContent}
import views.html.newspaperArchive

class NewspaperArchiveController(
    actionRefiners: CustomActionBuilders,
    assetsResolver: AssetsResolver,
) {
  import actionRefiners._

  def getHeader: Action[AnyContent] = CachedAction() { implicit request =>
    assetsResolver.getSsrCacheContentsAsHtml(divId = "content", file = "ssr-newspaper-archive-header.html") match {
      case EmptyDiv(_) => InternalServerError("Failed to load newspaper archive content")
      case SSRContent(_, htmlElement, _) => Ok(newspaperArchive(htmlElement))
    }

  }
}
