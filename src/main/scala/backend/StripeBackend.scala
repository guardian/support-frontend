package backend

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient
import util.EnvironmentBasedBuilder

import scala.concurrent.Future

import conf.{ConfigLoader, IdentityConfig, StripeConfig}
import model._
import model.db.ContributionData
import model.stripe.{StripeChargeData, StripeChargeError, StripeChargeSuccess}
import services._

// Provides methods required by the Stripe controller
// TODO: include dependency on acquisition producer service
class StripeBackend(stripeService: StripeService, databaseService: DatabaseService, identityService: IdentityService) extends StrictLogging {

  // Convert the result of the identity id operation,
  // into the monad used by the for comprehension in the createCharge() method.
  def getOrCreateIdentityIdFromEmail(email: String)(implicit pool: DefaultThreadPool): EitherT[Future, StripeChargeError, Long] =
    identityService.getOrCreateIdentityIdFromEmail(email).leftMap(err => StripeChargeError.fromThrowable(err))

  // TODO: send acquisition event
  // Ok using the default thread pool - the mapping function is not computationally intensive, nor does is perform IO.
  def createCharge(data: StripeChargeData)(implicit pool: DefaultThreadPool): EitherT[Future, StripeChargeError, StripeChargeSuccess] =
    for {
      identityId <- getOrCreateIdentityIdFromEmail(data.identityData.email)
      charge <- stripeService.createCharge(data)
    } yield {
      // Don't use flat map for inserting the contribution data -
      // the result the client receives as to whether the charge is successful,
      // should not be dependent on this operation.
      val contributionData = ContributionData.fromStripeCharge(Some(identityId), charge)
      databaseService.insertContributionData(contributionData)
      StripeChargeSuccess.fromContributionData(contributionData)
    }
}

object StripeBackend {

  private def apply(stripeService: StripeService, databaseService: DatabaseService, identityService: IdentityService): StripeBackend =
    new StripeBackend(stripeService, databaseService, identityService)

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider)(
    implicit defaultThreadPool: DefaultThreadPool,
    stripeThreadPool: StripeThreadPool,
    jdbcThreadPool: JdbcThreadPool,
    wsClient: WSClient
  ) extends EnvironmentBasedBuilder[StripeBackend] {

    override def build(env: Environment): InitializationResult[StripeBackend] = (
      configLoader
        .configForEnvironment[StripeConfig](env)
        .map(StripeService.fromStripeConfig): InitializationResult[StripeService],
      databaseProvider
        .loadDatabase(env)
        .map(PostgresDatabaseService.fromDatabase): InitializationResult[DatabaseService],
      configLoader
        .configForEnvironment[IdentityConfig](env)
        .map(IdentityService.fromIdentityConfig): InitializationResult[IdentityService]
    ).mapN(StripeBackend.apply)
  }
}

