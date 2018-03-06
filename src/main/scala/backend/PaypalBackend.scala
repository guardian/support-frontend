package backend

import cats.data.EitherT
import com.paypal.api.payments.Payment

import conf.{ConfigLoader, IdentityConfig, PaypalConfig}

import conf.{ConfigLoader, PaypalConfig}
import model.db.ContributionData
import model.paypal.{CapturePaypalPaymentData, CreatePaypalPaymentData, ExecutePaypalPaymentData, PaypalApiError}
import model._
import services._
import util.EnvironmentBasedBuilder
import cats.implicits._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient

import scala.concurrent.Future

class PaypalBackend(paypalService: PaypalService, databaseService: DatabaseService, identityService: IdentityService) extends StrictLogging {

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

  private def apply(paypalService: PaypalService, databaseService: DatabaseService, identityService: IdentityService): PaypalBackend =
    new PaypalBackend(paypalService, databaseService, identityService)

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider)(
    implicit defaultThreadPool: DefaultThreadPool,
    paypalThreadPool: PaypalThreadPool,
    jdbcThreadPool: JdbcThreadPool,
    wsClient: WSClient
  ) extends EnvironmentBasedBuilder[PaypalBackend] {

    override def build(env: Environment): InitializationResult[PaypalBackend] = (
      configLoader
        .configForEnvironment[PaypalConfig](env)
        .map(PaypalService.fromPaypalConfig): InitializationResult[PaypalService],
      databaseProvider
        .loadDatabase(env)
        .map(PostgresDatabaseService.fromDatabase): InitializationResult[DatabaseService],
      configLoader
        .configForEnvironment[IdentityConfig](env)
        .map(IdentityService.fromIdentityConfig): InitializationResult[IdentityService]
    ).mapN(PaypalBackend.apply)
  }
}

