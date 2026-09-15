package com.gu.support.config

import com.typesafe.config.Config

/** Config for a single `promotions-api` backend environment (CODE or PROD), resolved via
  * [[PromotionsApiConfigProvider]] / [[TouchpointConfigProvider]] - the same mechanism used for
  * Zuora/Stripe/PayPal/etc, so that a PROD-deployed instance transparently gets both the PROD backend (for regular
  * users) and the CODE backend (for test users previewing CODE-only promotions), while a CODE-deployed instance only
  * ever needs its own CODE backend/key - it never needs the real PROD key, since [[TouchpointConfigProvider.get]]
  * resolves both `defaultConfig` and `testConfig` to CODE in that case.
  *
  * `apiKey` is an `Option` (rather than required, like [[SalesTaxApiConfig.apiKey]]) because it needs to be provisioned
  * in Parameter Store as a separate infra step - see guardian/support-frontend#8207 - and we don't want app startup to
  * depend on that ordering. If a key is missing, [[services.PromotionsApiService]] simply logs a warning and returns an
  * empty result, rather than crashing on boot.
  */
case class PromotionsApiConfig(environment: TouchPointEnvironment, url: String, apiKey: Option[String])

class PromotionsApiConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[PromotionsApiConfig](config, defaultStage) {
  override protected def fromConfig(config: Config): PromotionsApiConfig = PromotionsApiConfig.fromConfig(config)
}

object PromotionsApiConfig {
  def fromConfig(config: Config): PromotionsApiConfig =
    PromotionsApiConfig(
      TouchPointEnvironments.fromString(config.getString("environment")),
      config.getString("promotionsApi.url"),
      if (config.hasPath("promotionsApi.key")) Some(config.getString("promotionsApi.key")) else None,
    )
}
