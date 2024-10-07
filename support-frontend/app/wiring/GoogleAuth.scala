package wiring

import com.gu.googleauth.{AntiForgeryChecker, AuthAction, GoogleAuthConfig}
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import play.filters.HttpFiltersComponents

import controllers.{Login, routes}
import play.api.mvc.AnyContent

trait GoogleAuth {
  self: BuiltInComponentsFromContext with AhcWSComponents with HttpFiltersComponents with ApplicationConfiguration =>

  private val googleAuthConfig = GoogleAuthConfig(
    appConfig.googleAuth.clientId,
    appConfig.googleAuth.clientSecret,
    appConfig.googleAuth.redirectUrl,
    List(appConfig.googleAuth.domain),
    antiForgeryChecker = AntiForgeryChecker.borrowSettingsFromPlay(httpConfiguration),
  )

  val authAction: AuthAction[AnyContent] =
    new AuthAction[AnyContent](googleAuthConfig, routes.Login.loginAction(), controllerComponents.parsers.default)

  val loginController: Login = new Login(googleAuthConfig, wsClient, controllerComponents)
}
