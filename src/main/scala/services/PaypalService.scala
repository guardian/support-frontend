package services

import conf.PaypalConfig

class PaypalService(config: PaypalConfig) {

}

object PaypalService {

  def fromConfig(config: PaypalConfig): PaypalService = new PaypalService(config)
}
