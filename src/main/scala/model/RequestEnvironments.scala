package model

// Models the environment to use for each request type.
sealed abstract class RequestEnvironments(val test: Environment, val live: Environment)

object RequestEnvironments {

  case object TestApp extends RequestEnvironments(test = Environment.Test, live = Environment.Test)

  case object LiveApp extends RequestEnvironments(test = Environment.Test, live = Environment.Live)

  def forAppMode(isProd: Boolean): RequestEnvironments = if (isProd) LiveApp else TestApp
}
