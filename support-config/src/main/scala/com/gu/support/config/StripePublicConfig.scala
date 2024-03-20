package com.gu.support.config

import com.gu.i18n.Country
import com.gu.support.workers.StripePublicKey
import com.typesafe.config.Config

case class StripePublicConfig(
    defaultAccount: StripePublicKey,
    australiaAccount: StripePublicKey,
    unitedStatesAccount: StripePublicKey,
)

class StripePublicConfigProvider(config: Config, defaultStage: Stage, prefix: String = "stripe")
    extends TouchpointConfigProvider[StripePublicConfig](config, defaultStage) {
  def fromConfig(config: Config): StripePublicConfig = StripePublicConfig(
    accountFromConfig(config, prefix, "default"),
    accountFromConfig(config, prefix, Country.Australia.alpha2),
    accountFromConfig(config, prefix, Country.US.alpha2),
  )

  private def accountFromConfig(config: Config, prefix: String, country: String): StripePublicKey =
    StripePublicKey.get(config.getString(s"$prefix.$country.api.key.public"))

}
