package wiring

import admin.AllSettingsProvider
import cats.syntax.either._
import com.gu.support.config.Stages.PROD
import com.gu.support.pricing.PriceSummaryServiceProvider
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import services.aws.AwsS3Client.s3
import services.paypal.PayPalNvpServiceProvider
import services.stepfunctions.{Encryption, StateWrapper, SupportWorkersClient}
import services.{IdentityService, _}

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit private val implicitWs = wsClient

  lazy val membersDataService = MembersDataService(appConfig.membersDataServiceApiUrl)

  lazy val payPalNvpServiceProvider = new PayPalNvpServiceProvider(appConfig.regularPayPalConfigProvider, wsClient)

  lazy val identityService = IdentityService(appConfig.identity)

  lazy val goCardlessServiceProvider = new GoCardlessServiceProvider(appConfig.goCardlessConfigProvider)

  lazy val supportWorkersClient = {
    val stateWrapper = new StateWrapper(Encryption.getProvider(appConfig.aws), appConfig.aws.useEncryption)
    SupportWorkersClient(
      appConfig.stepFunctionArn,
      stateWrapper,
      appConfig.supportUrl,
      controllers.routes.SupportWorkersStatus.status
    )
  }

  lazy val testUsers = TestUserService(appConfig.identity.testUserSecret)

  lazy val authenticationService = AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider

  lazy val paymentAPIService = new PaymentAPIService(wsClient, appConfig.paymentApiUrl)

  lazy val allSettingsProvider: AllSettingsProvider = AllSettingsProvider.fromConfig(appConfig).valueOr(throw _)

  lazy val priceSummaryServiceProvider: PriceSummaryServiceProvider =
    new PriceSummaryServiceProvider(appConfig.promotionsConfigProvider, PROD) //PROD is the only catalog which is complete
}
