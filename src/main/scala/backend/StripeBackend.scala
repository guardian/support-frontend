package backend

import akka.actor.ActorSystem
import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import com.typesafe.scalalogging.StrictLogging
import util.EnvironmentBasedBuilder

import scala.concurrent.Future

import conf.{ConfigLoader, StripeConfig}
import model.{DefaultThreadPool, Environment, InitializationResult}
import model.db.ContributionData
import model.stripe.{StripeChargeData, StripeChargeError, StripeChargeSuccess}
import services.{DatabaseProvider, DatabaseService, PostgresDatabaseService, StripeService}

// Provides methods required by the Stripe controller
// TODO: include dependency on acquisition producer service
class StripeBackend(stripeService: StripeService, databaseService: DatabaseService) extends StrictLogging {

  // TODO: send acquisition event
  // Ok using the default thread pool - the mapping function is not computationally intensive, nor does is perform IO.
  def createCharge(data: StripeChargeData)(implicit pool: DefaultThreadPool): EitherT[Future, StripeChargeError, StripeChargeSuccess] =
    stripeService.createCharge(data)
      // No flat map here - the result the client receives as to whether the charge is successful,
      // should not be dependent on the insertion of the contribution data.
      .map { charge =>
        val contributionData = ContributionData.fromStripeCharge(data.identityData.identityId, charge)
        databaseService.insertContributionData(contributionData)
        StripeChargeSuccess.fromContributionData(contributionData)
      }
}

object StripeBackend {

  private def apply(stripeService: StripeService, databaseService: DatabaseService): StripeBackend =
    new StripeBackend(stripeService, databaseService)

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider)(implicit system: ActorSystem)
    extends EnvironmentBasedBuilder[StripeBackend] {

    override def build(env: Environment): InitializationResult[StripeBackend] = (
      configLoader
        .configForEnvironment[StripeConfig](env)
        .andThen(StripeService.fromStripeConfig): InitializationResult[StripeService],
      databaseProvider
        .loadDatabase(env)
        .andThen(PostgresDatabaseService.fromDatabase): InitializationResult[DatabaseService]
    ).mapN(StripeBackend.apply)
  }
}

