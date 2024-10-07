package fixtures

import play.api._
import java.io.File

import play.api.inject.DefaultApplicationLifecycle
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import play.core.DefaultWebCommands
import play.filters.csrf.CSRFComponents
import play.filters.csrf.{CSRFAddToken, CSRFCheck, CSRFConfig}

trait TestCSRFComponents {

  private lazy val appComponents = {
    val env = Environment.simple(new File("."))
    val context = ApplicationLoader.Context.create(env)
    new BuiltInComponentsFromContext(context) with CSRFComponents {
      override def router: Router = ???

      override def httpFilters: Seq[EssentialFilter] = ???
    }
  }

  lazy val csrfConfig: CSRFConfig = appComponents.csrfConfig
  lazy val csrfAddToken: CSRFAddToken = appComponents.csrfAddToken
  lazy val csrfCheck: CSRFCheck = appComponents.csrfCheck
}
