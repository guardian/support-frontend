package com.gu.support.config

import com.typesafe.config.Config

/** Unlike [[SalesTaxApiConfig]] (a single URL/key pair, resolved per-deployed-stage), we need both the CODE and PROD
  * `promotions-api` keys available regardless of which stage support-frontend itself is deployed to - mirroring
  * `ProductCatalogService`'s Prod/Code split - so that test users hitting a PROD-deployed app can still preview
  * CODE-only promotions.
  *
  * Both keys are `Option`s (rather than required, like [[SalesTaxApiConfig.apiKey]]) because they need to be
  * provisioned in Parameter Store as a separate infra step - see guardian/support-frontend#8207 - and we don't want app
  * startup to depend on that ordering. If a key is missing, [[services.CachedPromotionsService]] simply logs a warning
  * and continues with an empty cache for that stage, rather than crashing on boot.
  */
case class PromotionsApiConfig(codeApiKey: Option[String], prodApiKey: Option[String])

object PromotionsApiConfig {
  def fromConfig(config: Config): PromotionsApiConfig = {
    def optionalString(path: String): Option[String] =
      if (config.hasPath(path)) Some(config.getString(path)) else None

    PromotionsApiConfig(
      optionalString("promotionsApi.code.key"),
      optionalString("promotionsApi.prod.key"),
    )
  }
}
