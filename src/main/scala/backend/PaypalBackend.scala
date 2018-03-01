package backend

import akka.actor.ActorSystem
import cats.syntax.apply._
import com.paypal.api.payments.Payment
import conf.{ConfigLoader, PaypalConfig}
import model.paypal.CreatePaypalPaymentData
import model.{Environment, InitializationResult}
import services._
import util.EnvironmentBasedBuilder


class PaypalBackend(paypalService: PaypalService, databaseService: DatabaseService) extends Paypal {

  def createPayment(paypalPaymentData: CreatePaypalPaymentData): PaypalResult[Payment] = {
    paypalService.createPayment(paypalPaymentData)
  }

}

object PaypalBackend {

  private def apply(paypalService: PaypalService, databaseService: DatabaseService): PaypalBackend =
    new PaypalBackend(paypalService, databaseService)

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider)(implicit system: ActorSystem)
    extends EnvironmentBasedBuilder[PaypalBackend] {

    override def build(env: Environment): InitializationResult[PaypalBackend] = (
      configLoader
        .configForEnvironment[PaypalConfig](env)
        .andThen(PaypalService.fromPaypalConfig): InitializationResult[PaypalService],
      databaseProvider
        .loadDatabase(env)
        .andThen(PostgresDatabaseService.fromDatabase): InitializationResult[DatabaseService]
    ).mapN(PaypalBackend.apply)
  }

}

