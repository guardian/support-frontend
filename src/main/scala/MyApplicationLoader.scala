import play.api.ApplicationLoader.Context
import play.api.{ApplicationLoader, BuiltInComponentsFromContext, NoHttpFiltersComponents}
import router.Routes

class MyApplicationLoader extends ApplicationLoader {
  def load(context: Context) = {
    // logging initialisation needs to happen here
    new MyComponents(context).application
  }
}

class MyComponents(context: Context) extends BuiltInComponentsFromContext(context) with NoHttpFiltersComponents {
  lazy val router = new Routes(httpErrorHandler, new controllers.HomeController(controllerComponents))
}
