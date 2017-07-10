package wiring

import services.stepfunctions.{Encryption, MonthlyContributionsClient}
import services.stepfunctions.StateWrapper
import play.api.libs.ws.ahc.AhcWSComponents
import services.{AuthenticationService, IdentityService, MembersDataService, TestUserService}
import play.api.BuiltInComponentsFromContext
import config.Stages

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit private val implicitWs = wsClient

  implicit lazy val membersDataService = MembersDataService(appConfig.membersDataServiceApiUrl)

  implicit lazy val identityService = IdentityService(appConfig.identity)

  implicit lazy val touchpointConfigProvider = appConfig.touchpointConfigProvider

  implicit lazy val stateWrapper = new StateWrapper(Encryption.getProvider(appConfig.aws))

  implicit lazy val monthlyContributionsClient = {
    val monthlyContributionsStage = if (appConfig.stage == Stages.DEV) Stages.CODE else appConfig.stage
    MonthlyContributionsClient(monthlyContributionsStage)
  }

  implicit lazy val testUsers = TestUserService(appConfig.identity.testUserSecret)

  lazy val authenticationService = AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider
}