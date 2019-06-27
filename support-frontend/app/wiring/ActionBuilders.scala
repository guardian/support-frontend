package wiring

import actions.CustomActionBuilders
import play.api.BuiltInComponentsFromContext
import play.filters.HttpFiltersComponents

trait ActionBuilders {
  self: Services with BuiltInComponentsFromContext with ApplicationConfiguration with HttpFiltersComponents =>

  implicit lazy val actionRefiners = new CustomActionBuilders(
    authenticationService = authenticationService,
    idWebAppUrl = appConfig.identity.webappUrl,
    supportUrl = appConfig.supportUrl,
    cc = controllerComponents,
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig
  )
}
