package wiring

import com.gu.support.config.Stages
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import services._
import services.paypal.PayPalServiceProvider
import services.stepfunctions.{Encryption, MonthlyContributionsClient, StateWrapper}

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit private val implicitWs = wsClient

  lazy val membersDataService = MembersDataService(appConfig.membersDataServiceApiUrl)

  lazy val payPalServiceProvider = new PayPalServiceProvider(appConfig.payPalConfigProvider, wsClient)

  lazy val identityService = IdentityService(appConfig.identity)

  lazy val monthlyContributionsClient = {
    val stateWrapper = new StateWrapper(Encryption.getProvider(appConfig.aws))
    val monthlyContributionsStage = if (appConfig.stage == Stages.DEV) Stages.CODE else appConfig.stage
    MonthlyContributionsClient(
      monthlyContributionsStage,
      stateWrapper,
      appConfig.supportUrl,
      controllers.routes.MonthlyContributions.status
    )
  }

  lazy val testUsers = TestUserService(appConfig.identity.testUserSecret)

  lazy val authenticationService = AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider
}