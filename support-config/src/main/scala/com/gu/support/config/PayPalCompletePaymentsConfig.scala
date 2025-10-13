package com.gu.support.config

import com.typesafe.config.Config

case class PayPalCompletePaymentsConfig(
    url: String,
)

class PayPalCompletePaymentsConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[PayPalCompletePaymentsConfig](config, defaultStage) {
  def fromConfig(config: Config): PayPalCompletePaymentsConfig = {
    PayPalCompletePaymentsConfig(
      config.getString("paypal-complete-payments.url"),
    )
  }
}
