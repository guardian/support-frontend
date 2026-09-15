package com.gu.support.config

import com.typesafe.config.Config

/** Config for a single `promotions-api` backend environment (CODE or PROD), resolved via
  * [[PromotionsApiConfigProvider]] / [[TouchpointConfigProvider]] - the same mechanism used for
  * Zuora/Stripe/PayPal/etc, so that a PROD-deployed instance transparently gets both the PROD backend (for regular
  * users) and the CODE backend (for test users previewing CODE-only promotions), while a CODE-deployed instance only
  * ever needs its own CODE backend/key - it never needs the real PROD key, since [[TouchpointConfigProvider.get]]
  * resolves both `defaultConfig` and `testConfig` to CODE in that case.
  *
  * `apiKey` is required, like [[SalesTaxApiConfig.apiKey]] - if it's missing from Parameter Store, app startup fails
  * loudly (a `ConfigException.Missing`) rather than silently running with an empty promotions cache.
  */
case class PromotionsApiConfig(environment: TouchPointEnvironment, url: String, apiKey: String)

class PromotionsApiConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[PromotionsApiConfig](config, defaultStage) {
  override protected def fromConfig(config: Config): PromotionsApiConfig = PromotionsApiConfig.fromConfig(config)
}

object PromotionsApiConfig {
  def fromConfig(config: Config): PromotionsApiConfig =
    PromotionsApiConfig(
      TouchPointEnvironments.fromString(config.getString("environment")),
      config.getString("promotionsApi.url"),
      config.getString("promotionsApi.key"),
    )
}
