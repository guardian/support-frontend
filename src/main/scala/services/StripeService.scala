package services

import conf.StripeConfig

class StripeService(config: StripeConfig) {

  def executePayment(): Unit = ()
}

object StripeService {
  def fromConfig(config: StripeConfig): StripeService = new StripeService(config)
}