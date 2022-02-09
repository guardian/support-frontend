package controllers

import play.api.mvc._
import play.api.mvc.Results._
import actions.CustomActionBuilders
import com.gu.support.config.{Stage, Stages}
import play.api.http.FileMimeTypes

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

class Favicon(
    actionRefiners: CustomActionBuilders,
    stage: Stage,
)(implicit fileMimeTypes: FileMimeTypes, ec: ExecutionContext) {

  import actionRefiners._
  def get(): Action[AnyContent] = CachedAction(365.days) {
    stage match {
      case Stages.DEV => Ok.sendResource("favicon.32x32-dev.ico")
      case _ => Ok.sendResource("favicon.32x32.ico")
    }
  }

}
