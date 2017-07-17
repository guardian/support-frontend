package fixtures

import play.api._
import java.io.File

import play.api.inject.DefaultApplicationLifecycle
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import play.core.DefaultWebCommands
import play.filters.csrf.CSRFComponents

trait TestCSRFComponents {

  private lazy val appComponents = {
    val env = Environment.simple(new File("."))
    val configuration = Configuration.load(env)
    val context = ApplicationLoader.Context(
      environment = env,
      sourceMapper = None,
      webCommands = new DefaultWebCommands(),
      initialConfiguration = configuration,
      lifecycle = new DefaultApplicationLifecycle()
    )
    new BuiltInComponentsFromContext(context) with CSRFComponents {
      override def router: Router = ???

      override def httpFilters: Seq[EssentialFilter] = ???
    }
  }

  lazy val csrfConfig = appComponents.csrfConfig
  lazy val csrfAddToken = appComponents.csrfAddToken
  lazy val csrfCheck = appComponents.csrfCheck
}