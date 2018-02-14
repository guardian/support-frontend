package backend

import cats.syntax.apply._
import cats.syntax.either._
import util.EnvironmentBasedBuilder

import conf.{ConfigLoader, StripeConfig}
import model.{Environment, InitializationResult}
import model.db.ContributionData
import model.stripe.{StripeChargeData, StripeChargeError, StripeChargeSuccess}
import services.{DatabaseProvider, DatabaseService, StripeService}

// Provides methods required by the Stripe controller
// TODO: include dependency on acquisition producer service
class StripeBackend(stripeService: StripeService, databaseService: DatabaseService) {

  // TODO: send acquisition event
  def createCharge(data: StripeChargeData): Either[StripeChargeError, StripeChargeSuccess] =
    stripeService.createCharge(data)
      .map { success =>
        val contributionData = ContributionData.fromStripeChargeSuccess(success)
        // The result the client receives as to whether the charge is successful,
        // should not be dependent on the insertion of the contribution data.
        databaseService.insertContributionData(contributionData).leftMap(err => null) // TODO: enable logging
        success
      }
}

object StripeBackend {

  private def apply(stripeService: StripeService, databaseService: DatabaseService): StripeBackend =
    new StripeBackend(stripeService, databaseService)

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider) extends EnvironmentBasedBuilder[StripeBackend] {
    override def build(env: Environment): InitializationResult[StripeBackend] = (
      configLoader.loadConfig[StripeConfig](env).map(StripeService.fromConfig): InitializationResult[StripeService],
      databaseProvider.loadDatabase(env).map(DatabaseService.apply): InitializationResult[DatabaseService]
    ).mapN(StripeBackend.apply)
  }
}

