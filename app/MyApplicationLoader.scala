import play.api.{ApplicationLoader, BuiltInComponentsFromContext}
import play.api.ApplicationLoader.Context
import play.filters.HttpFiltersComponents
import router.Routes

class MyApplicationLoader extends ApplicationLoader {
  def load(context: Context) = {
    // logging initialisation needs to happen here
    new MyComponents(context).application
  }
}

class MyComponents(context: Context) extends BuiltInComponentsFromContext(context) with HttpFiltersComponents {
  lazy val router = new Routes(httpErrorHandler, new controllers.HomeController(controllerComponents))
}