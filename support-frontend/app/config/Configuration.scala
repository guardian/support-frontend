package config

import admin.settings.SettingsSources
import cats.syntax.either._
import com.gu.support.config._
import config.ConfigImplicits._
import config.Configuration.{GuardianDomain, MetricUrl}
import services.stepfunctions.StateMachineArn
import com.typesafe.config.{Config => TypesafeConfig}

class Configuration(config: TypesafeConfig) {

  lazy val stage: Stage = Stage.fromString(config.getString("stage")).get

  lazy val sentryDsn: Option[String] = config.getOptionalString("sentry.dsn")

  lazy val identity: Identity = new Identity(config.getConfig("identity"))

  lazy val googleAuth: GoogleAuth = new GoogleAuth(config.getConfig("googleAuth"))

  lazy val getAddressIOConfig: GetAddressIOConfig = GetAddressIOConfig.fromConfig(config)

  lazy val paperRoundConfigProvider: PaperRoundConfigProvider = new PaperRoundConfigProvider(config, stage)

  lazy val guardianDomain: GuardianDomain = GuardianDomain(config.getString("guardianDomain"))

  lazy val supportUrl: String = config.getString("support.url")

  lazy val paymentApiUrl: String = config.getString("paymentApi.url")

  lazy val membersDataServiceApiUrl: String = config.getString("membersDataService.api.url")

  lazy val metricUrl: MetricUrl = MetricUrl(config.getString("metric.url"))

  lazy val goCardlessConfigProvider: GoCardlessConfigProvider = new GoCardlessConfigProvider(config, stage)

  lazy val regularPayPalConfigProvider: PayPalConfigProvider = new PayPalConfigProvider(config, stage)

  lazy val regularStripeConfigProvider: StripePublicConfigProvider = new StripePublicConfigProvider(config, stage)

  lazy val oneOffStripeConfigProvider: StripePublicConfigProvider =
    new StripePublicConfigProvider(config, stage, "oneOffStripe")

  lazy val amazonPayConfigProvider: AmazonPayConfigProvider = new AmazonPayConfigProvider(config, stage)

  lazy val stepFunctionArn: StateMachineArn = StateMachineArn.fromString(config.getString("supportWorkers.arn")).get

  lazy val settingsSources: SettingsSources = SettingsSources.fromConfig(config, stage).valueOr(throw _)

  lazy val fastlyConfig: Option[FastlyConfig] = FastlyConfig.fromConfig(config).valueOr(throw _)

  lazy val priceSummaryConfigProvider: PriceSummaryConfigProvider = new PriceSummaryConfigProvider(config, stage)

  lazy val promotionsConfigProvider: PromotionsConfigProvider = new PromotionsConfigProvider(config, stage)

  lazy val recaptchaConfigProvider: RecaptchaConfigProvider = new RecaptchaConfigProvider(config, stage)

  lazy val capiKey: String = config.getString("capi-key")

  lazy val zuoraConfigProvider: ZuoraConfigProvider = new ZuoraConfigProvider(config, stage)
}

object Configuration {
  case class GuardianDomain(value: String)
  case class IdentityUrl(value: String)
  case class MetricUrl(value: String) extends AnyVal
}
