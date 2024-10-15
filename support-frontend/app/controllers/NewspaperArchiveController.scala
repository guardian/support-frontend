package controllers

import actions.CustomActionBuilders
import play.api.mvc.{Action, AnyContent}
import play.api.mvc.Results.Ok

class NewspaperArchiveController(
    actionRefiners: CustomActionBuilders,
) {
  import actionRefiners._
  def getHeader(): Action[AnyContent] = CachedAction() { request =>
    Ok("Newspaper Archive")
  }
}
