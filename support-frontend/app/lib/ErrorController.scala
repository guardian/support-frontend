package lib

import actions.CustomActionBuilders
import play.api.UsefulException
import play.api.mvc._

class ErrorController(
    actionRefiners: CustomActionBuilders,
    customHttpErrorHandler: CustomHttpErrorHandler,
) {

  import actionRefiners._
  def error500(): Action[AnyContent] = NoCacheAction().async { request =>
    customHttpErrorHandler.renderErrorInDev(request, new UsefulException("test error") {})
  }

}
