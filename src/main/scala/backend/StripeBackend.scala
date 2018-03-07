package backend

import backend.StripeBackend.StripeBackendError
import cats.data.EitherT
import cats.syntax.apply._
import com.stripe.model.Charge
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient
import util.EnvironmentBasedBuilder
import cats.instances.future.catsStdInstancesForFuture
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
  def getOrCreateIdentityIdFromEmail(email: String)(implicit pool: DefaultThreadPool): EitherT[Future, StripeBackendError, Long] =
    identityService.getOrCreateIdentityIdFromEmail(email).leftMap(StripeBackendError.fromIdentityError)


  def insetContributionData(contributionData: ContributionData)(implicit pool: DefaultThreadPool): EitherT[Future, StripeBackendError, Unit] = {
    databaseService.insertContributionData(contributionData).leftMap(StripeBackendError.fromDatabaseError)
  }

  def trackContribution(charge: Charge, data: StripeChargeData)(implicit pool: DefaultThreadPool): EitherT[Future, StripeBackendError, Unit]  = {
    getOrCreateIdentityIdFromEmail(data.identityData.email).map(Option(_))
      .recover {
        case err => {
          logger.error(err.getMessage)
          None
        }
      }
      .flatMap { identityId =>
        val contributionData = ContributionData.fromStripeCharge(identityId, charge)
        insetContributionData(contributionData)
      }
  }


  // TODO: send acquisition event
  // Ok using the default thread pool - the mapping function is not computationally intensive, nor does is perform IO.
  def createCharge(data: StripeChargeData)(implicit pool: DefaultThreadPool): EitherT[Future, StripeChargeError, StripeChargeSuccess] =
    for {
      charge <- stripeService.createCharge(data)
      _ = trackContribution(charge, data)
    } yield StripeChargeSuccess.fromCharge(charge)

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

  sealed abstract class StripeBackendError extends Exception {
    override def getMessage: String = this match {
      case StripeBackendError.Database(err) => err.getMessage
      case StripeBackendError.Service(err) => err.getMessage
    }
  }

  object StripeBackendError {
    final case class Database(error: DatabaseService.Error) extends StripeBackendError
    final case class Service(error: IdentityClient.Error) extends StripeBackendError

    def fromIdentityError(err: IdentityClient.Error): StripeBackendError = Service(err)
    def fromDatabaseError(err: DatabaseService.Error): StripeBackendError = Database(err)
  }

}

