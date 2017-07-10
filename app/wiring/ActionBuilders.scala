package wiring

import actions.ActionRefiners
import play.api.BuiltInComponentsFromContext

trait ActionBuilders {
  self: Services with BuiltInComponentsFromContext with ApplicationConfiguration =>

  implicit lazy val actionRefiners = new ActionRefiners(
    authenticatedIdUserProvider = authenticationService,
    idWebAppUrl = appConfig.identity.webappUrl,
    supportUrl = appConfig.supportUrl,
    testUsers = testUsers,
    cc = controllerComponents
  )
}