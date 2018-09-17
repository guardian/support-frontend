package wiring

import admin.SettingsProvider
import cats.syntax.either._
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents

import services._
import services.aws.AwsS3Client.s3
import services.paypal.PayPalNvpServiceProvider
import services.stepfunctions.{Encryption, RegularContributionsClient, StateWrapper}

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit private val implicitWs = wsClient

  lazy val membersDataService = MembersDataService(appConfig.membersDataServiceApiUrl)

  lazy val payPalNvpServiceProvider = new PayPalNvpServiceProvider(appConfig.regularPayPalConfigProvider, wsClient)

  lazy val identityService = IdentityService(appConfig.identity)

  lazy val goCardlessServiceProvider = new GoCardlessServiceProvider(appConfig.goCardlessConfigProvider)

  lazy val regularContributionsClient = {
    val stateWrapper = new StateWrapper(Encryption.getProvider(appConfig.aws), appConfig.aws.useEncryption)
    RegularContributionsClient(
      appConfig.stepFunctionArn,
      stateWrapper,
      appConfig.supportUrl,
      controllers.routes.RegularContributions.status
    )
  }

  lazy val testUsers = TestUserService(appConfig.identity.testUserSecret)

  lazy val authenticationService = AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider

  lazy val paymentAPIService = new PaymentAPIService(wsClient, appConfig.paymentApiUrl)

  lazy val settingsProvider: SettingsProvider = SettingsProvider.fromAppConfig(appConfig).valueOr(throw _)
}
