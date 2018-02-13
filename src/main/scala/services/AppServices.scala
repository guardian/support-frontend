package services

import cats.syntax.apply._

import conf.{ConfigLoader, PaypalConfig, StripeConfig}
import conf.ConfigLoader.ParameterStoreLoadable
import model.{InitializationResult, RequestEnvironments}

case class AppServices(
  stripeServiceProvider: ServiceProvider[StripeService],
  paypalServiceProvider: ServiceProvider[PaypalService]
)

object AppServices {

  class AppServicesBuilder(configLoader: ConfigLoader, environments: RequestEnvironments) {

    def buildServiceProvider[Config : ParameterStoreLoadable, Service](builder: Config => Service): InitializationResult[ServiceProvider[Service]] = (
      // Help out IntelliJ by specifying the type explicitly
      configLoader.loadConfig[Config](environments.test).map(builder): InitializationResult[Service],
      configLoader.loadConfig[Config](environments.live).map(builder): InitializationResult[Service]
    ).mapN(ServiceProvider.apply)

    def build(): InitializationResult[AppServices] = (
      buildServiceProvider[StripeConfig, StripeService](StripeService.fromConfig),
      buildServiceProvider[PaypalConfig, PaypalService](PaypalService.fromConfig)
    ).mapN(AppServices.apply)
  }

  def build(configLoader: ConfigLoader, environments: RequestEnvironments): InitializationResult[AppServices] =
    new AppServicesBuilder(configLoader, environments).build()
}
