package com.gu.support.config

import com.gu.i18n.{Country, Currency}
import com.gu.i18n.Currency.AUD
import com.gu.monitoring.SafeLogging
import com.gu.support.workers.{StripePublicKey, StripeSecretKey}
import com.gu.support.zuora.api.{PaymentGateway, StripeGatewayPaymentIntentsAUD, StripeGatewayPaymentIntentsDefault}
import com.typesafe.config.Config

case class StripeConfig(
    defaultAccount: StripeAccountConfig,
    australiaAccount: StripeAccountConfig,
    unitedStatesAccount: StripeAccountConfig,
    version: Option[String],
) extends SafeLogging {
  private val secretForPublic: Map[StripePublicKey, (StripeSecretKey, PaymentGateway)] = Map(
    defaultAccount.publicKey -> (defaultAccount.secretKey, StripeGatewayPaymentIntentsDefault),
    australiaAccount.publicKey -> (australiaAccount.secretKey, StripeGatewayPaymentIntentsAUD),
    unitedStatesAccount.publicKey -> (unitedStatesAccount.secretKey, StripeGatewayPaymentIntentsDefault), // US currently uses default account for recurring
  )

  def forPublicKey(publicKey: StripePublicKey): Option[(StripeSecretKey, PaymentGateway)] =
    secretForPublic.get(publicKey)
}

case class StripeAccountConfig(secretKey: StripeSecretKey, publicKey: StripePublicKey)

class StripeConfigProvider(config: Config, defaultStage: Stage, prefix: String = "stripe")
    extends TouchpointConfigProvider[StripeConfig](config, defaultStage) {
  def fromConfig(config: Config): StripeConfig = StripeConfig(
    accountFromConfig(config, prefix, "default"),
    accountFromConfig(config, prefix, Country.Australia.alpha2),
    accountFromConfig(config, prefix, Country.US.alpha2),
    version = stripeVersion(config),
  )

  private def accountFromConfig(config: Config, prefix: String, country: String) =
    StripeAccountConfig(
      secretKey = StripeSecretKey.get(config.getString(s"$prefix.$country.api.key.secret")),
      publicKey = StripePublicKey.get(config.getString(s"$prefix.$country.api.key.public")),
    )

  private def stripeVersion(config: Config): Option[String] = {
    val stripeVersion = "stripe.api.version"
    if (config.hasPath(stripeVersion)) Some(config.getString(stripeVersion)) else None
  }
}
