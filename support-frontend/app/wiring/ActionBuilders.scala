package wiring

import actions.CustomActionBuilders
import play.api.BuiltInComponentsFromContext
import play.filters.HttpFiltersComponents

trait ActionBuilders {
  self: Services with BuiltInComponentsFromContext with ApplicationConfiguration with HttpFiltersComponents =>

  implicit lazy val actionBuilders: CustomActionBuilders = new CustomActionBuilders(
    asyncAuthenticationService = asyncAuthenticationService,
    userFromAuthCookiesOrAuthServerActionBuilder = userFromAuthCookiesOrAuthServerActionBuilder,
    userFromAuthCookiesActionBuilder = userFromAuthCookiesActionBuilder,
    cc = controllerComponents,
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig,
    stage = appConfig.stage,
    featureSwitches = allSettingsProvider.getAllSettings().switches.featureSwitches,
    testUsersService = testUsers,
  )
}
