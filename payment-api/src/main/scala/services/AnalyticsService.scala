package services

import cats.data.{EitherT, Validated}
import cats.implicits._
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.acquisition.services.{DefaultAcquisitionService, Ec2OrLocalConfig}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder.ops._
import com.typesafe.scalalogging.StrictLogging
import conf.{ConfigLoader, KinesisConfig, OphanConfig}
import io.circe.Encoder
import model.{DefaultThreadPool, Environment, InitializationError, InitializationResult}
import okhttp3.{HttpUrl, OkHttpClient}
import io.circe.syntax._

import scala.concurrent.Future

class AnalyticsService(val ophanClient: DefaultAcquisitionService)(implicit pool: DefaultThreadPool) extends StrictLogging {
  import AnalyticsService._

  def submitAcquisition[A : AcquisitionSubmissionBuilder](acquisition: A): EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] = {
    acquisition.asAcquisitionSubmission.fold(
      buildError => {
        logger.error("Error building AcquisitionSubmission", buildError)
      },
      acquisitionSubmission => {
        logger.info(s"Sending acquisition event to ophan: ${acquisitionSubmission.asJson.noSpaces}")
      }
    )

    ophanClient.submit(acquisition).leftMap { error =>
      logger.error("Error sending acquisition.", error)
      error
    }
  }
}

object AnalyticsService extends StrictLogging {
  implicit val acquisitionSubmissionEncoder: Encoder[AcquisitionSubmission] = {
    import com.gu.acquisition.instances.acquisition.acquisitionEncoder
    io.circe.generic.semiauto.deriveEncoder[AcquisitionSubmission]
  }

  private def getAnalyticsServiceConfig(configLoader: ConfigLoader, env: Environment)(implicit pool: DefaultThreadPool): InitializationResult[(OphanConfig, KinesisConfig)] = {
    import ConfigLoader.environmentShow
    val ophanResult = configLoader.loadConfig[Environment, OphanConfig](env)
    val kinesisResult = configLoader.loadConfig[Environment, KinesisConfig](env)

    import cats.syntax.apply._
    (ophanResult, kinesisResult)
      .mapN((ophan, kinesis) => (ophan, kinesis))
  }

  def fromConfig(ophanConfig: OphanConfig, kinesisConfig: KinesisConfig)(implicit pool: DefaultThreadPool): InitializationResult[AnalyticsService] = {
    Validated.catchNonFatal {
      implicit val client = new OkHttpClient()

      val credentialsProvider = new AWSCredentialsProviderChain(
        new ProfileCredentialsProvider("membership"),
        InstanceProfileCredentialsProvider.getInstance()
      )

      val acquisitionConfig = Ec2OrLocalConfig(
        credentialsProvider,
        kinesisStreamName = kinesisConfig.streamName,
        ophanEndpoint = Some(HttpUrl.parse(ophanConfig.ophanEndpoint))
      )

      new AnalyticsService(new DefaultAcquisitionService(acquisitionConfig))
    }.leftMap { err =>
      InitializationError(s"unable to instantiate AnalyticsService for config: $ophanConfig, $kinesisConfig. Error trace: ${err.getMessage}")
    }
  }

  def apply(configLoader: ConfigLoader, env: Environment)(implicit pool: DefaultThreadPool): InitializationResult[AnalyticsService] =
    getAnalyticsServiceConfig(configLoader, env).andThen {
      case (ophan, kinesis) => fromConfig(ophan, kinesis)
    }
}
