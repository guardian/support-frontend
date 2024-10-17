package controllers

import actions.CustomActionBuilders
import play.api.mvc.Results.Ok
import play.api.mvc.{Action, AnyContent}
import play.twirl.api.Html
import views.html.newspaperArchive

class NewspaperArchiveController(
    actionRefiners: CustomActionBuilders,
) {
  import actionRefiners._

  def getHeader: Action[AnyContent] = CachedAction() { implicit request =>
    Ok(newspaperArchive("Newspaper Archive")(Html("<h1>Hello World</h1>")))
  }
}
