package com.gu.support.config

import com.typesafe.config.Config

case class PayPalCompletePaymentsConfig(
    baseUrl: String,
    clientId: String,
    clientSecret: String,
)

class PayPalCompletePaymentsConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[PayPalCompletePaymentsConfig](config, defaultStage) {
  def fromConfig(config: Config): PayPalCompletePaymentsConfig = {
    PayPalCompletePaymentsConfig(
      config.getString("paypal-complete-payments.baseUrl"),
      config.getString("paypal-complete-payments.clientId"),
      config.getString("paypal-complete-payments.clientSecret"),
    )
  }
}
