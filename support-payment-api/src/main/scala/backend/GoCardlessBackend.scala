package backend

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.typesafe.scalalogging.StrictLogging
import conf.ConfigLoader._
import conf._
import model._
import model.directdebit.{CheckDirectDebitDetailsData, CheckDirectDebitDetailsResponse}
import services._
import util.EnvironmentBasedBuilder

import scala.concurrent.Future

// Provides methods required by the GoCardless controller
class GoCardlessBackend(
    goCardlessService: GoCardlessService,
    cloudWatchService: CloudWatchService,
)(implicit pool: DefaultThreadPool)
    extends StrictLogging {

  def checkBankAccount(data: CheckDirectDebitDetailsData): EitherT[Future, Throwable, CheckDirectDebitDetailsResponse] =
    goCardlessService
      .checkBankAccount(data)
      .map(CheckDirectDebitDetailsResponse.apply)
}

object GoCardlessBackend {

  private def apply(
      goCardlessService: GoCardlessService,
      cloudWatchService: CloudWatchService,
  )(implicit pool: DefaultThreadPool): GoCardlessBackend = {
    new GoCardlessBackend(goCardlessService, cloudWatchService)
  }

  class Builder(configLoader: ConfigLoader, cloudWatchAsyncClient: AmazonCloudWatchAsync)(implicit
      defaultThreadPool: DefaultThreadPool,
      goCardlessThreadPool: GoCardlessThreadPool,
  ) extends EnvironmentBasedBuilder[GoCardlessBackend] {

    override def build(env: Environment): InitializationResult[GoCardlessBackend] = (
      configLoader
        .loadConfig[Environment, GoCardlessConfig](env)
        .map(GoCardlessService.fromGoCardlessConfig): InitializationResult[GoCardlessService],
      new CloudWatchService(cloudWatchAsyncClient, env).valid: InitializationResult[CloudWatchService],
    ).mapN(GoCardlessBackend.apply)
  }
}
