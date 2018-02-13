package model

// Models the environment to use for each request type.
case class RequestEnvironments(test: Environment, live: Environment)

object RequestEnvironments {

  def forAppMode(isProd: Boolean): RequestEnvironments =
    RequestEnvironments(
      test = Environment.Test,
      // Only use the live environment if the app is running in production mode,
      // and a live request has been made.
      live = if (isProd) Environment.Live else Environment.Test
    )
}
