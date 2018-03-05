package backend

import akka.actor.ActorSystem
import cats.data.EitherT
import com.paypal.api.payments.Payment
import conf.{ConfigLoader, PaypalConfig}
import model.db.ContributionData
import model.paypal.{CapturePaypalPaymentData, CreatePaypalPaymentData, PaypalApiError, ExecutePaypalPaymentData}
import model.{DefaultThreadPool, Environment, InitializationResult}
import services._
import util.EnvironmentBasedBuilder
import cats.implicits._
import com.typesafe.scalalogging.StrictLogging

import scala.concurrent.Future

class PaypalBackend(paypalService: PaypalService, databaseService: DatabaseService) extends StrictLogging {

  /*
   *  Use by Webs: First stage to create a paypal payment. Using -sale- paypal flow combining authorization
   *  and capture process in one transaction. Sale option, PayPal processes the payment without holding funds.
   */
  def createPayment(paypalPaymentData: CreatePaypalPaymentData): EitherT[Future, PaypalApiError, Payment] =
    paypalService.createPayment(paypalPaymentData)


  /*
   *  Use by Apps: Apps have previously created the payment and managed its approval with the customer.
   *  Funds are captured at this stage.
   */
  def capturePayment(capturePaypalPaymentData: CapturePaypalPaymentData)(implicit pool: DefaultThreadPool):
  EitherT[Future, PaypalApiError, Payment] = {
    paypalService.capturePayment(capturePaypalPaymentData).map { payment =>
      ContributionData.fromPaypalCharge(None, payment).fold(
        error =>
          logger.error(s"Error generating contribution data while capturing paypal payment. Error trace: ", error),
        contributionData =>
          databaseService.insertContributionData(contributionData)
      )
      payment
    }
  }

  def executePayment(paypalExecutePaymentData: ExecutePaypalPaymentData)(implicit pool: DefaultThreadPool):
  EitherT[Future, PaypalApiError, Payment] =
    paypalService.executePayment(paypalExecutePaymentData)

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

