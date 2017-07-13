package fixtures

import play.api._
import wiring.AppComponents
import java.io.File

import play.api.inject.DefaultApplicationLifecycle
import play.core.DefaultWebCommands

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
    new BuiltInComponentsFromContext(context) with AppComponents
  }

  lazy val csrfConfig = appComponents.csrfConfig
  lazy val csrfAddToken = appComponents.csrfAddToken
  lazy val csrfCheck = appComponents.csrfCheck
}