package wiring

import assets.AssetsResolver
import services.stepfunctions.{Encryption, MonthlyContributionsClient}
import services.stepfunctions.StateWrapper
import play.api.libs.ws.ahc.AhcWSComponents
import services.{AuthenticationService, IdentityService, MembersDataService, TestUserService}
import play.api.BuiltInComponentsFromContext
import config.Stages

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit private val implicitWs = wsClient

  lazy val membersDataService = MembersDataService(appConfig.membersDataServiceApiUrl)

  lazy val identityService = IdentityService(appConfig.identity)

  lazy val touchpointConfigProvider = appConfig.touchpointConfigProvider

  lazy val monthlyContributionsClient = {
    val stateWrapper = new StateWrapper(Encryption.getProvider(appConfig.aws))
    val monthlyContributionsStage = if (appConfig.stage == Stages.DEV) Stages.CODE else appConfig.stage
    MonthlyContributionsClient(monthlyContributionsStage, stateWrapper)
  }

  lazy val testUsers = TestUserService(appConfig.identity.testUserSecret)

  lazy val authenticationService = AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider

  lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)
}