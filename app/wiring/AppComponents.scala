package wiring

import play.api.routing.Router
import router.Routes
import controllers.{Application, Assets}

trait AppComponents extends PlayComponents {

  lazy val assetController = new Assets(httpErrorHandler)
  lazy val applicationController = new Application()

  override lazy val router: Router = new Routes(httpErrorHandler, assetController, applicationController, prefix = "/")
}