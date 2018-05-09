package services

import cats.data.{EitherT, Validated}
import cats.implicits._
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.gu.acquisition.services.DefaultOphanService
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder.ops._
import com.typesafe.scalalogging.StrictLogging
import conf.OphanConfig
import io.circe.Encoder
import model.{DefaultThreadPool, InitializationError, InitializationResult}
import okhttp3.{HttpUrl, OkHttpClient}
import io.circe.syntax._

import scala.concurrent.Future

class OphanService(val ophanClient: DefaultOphanService)(implicit pool: DefaultThreadPool) extends StrictLogging {
  import OphanService._

  def submitAcquisition[A : AcquisitionSubmissionBuilder](acquisition: A): EitherT[Future, OphanServiceError, AcquisitionSubmission] = {
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

object OphanService {
  implicit val acquisitionSubmissionEncoder: Encoder[AcquisitionSubmission] = {
    import com.gu.acquisition.instances.acquisition.acquisitionEncoder
    io.circe.generic.semiauto.deriveEncoder[AcquisitionSubmission]
  }

  def fromOphanConfig(config: OphanConfig)(implicit pool: DefaultThreadPool): InitializationResult[OphanService] = {
    Validated.catchNonFatal {
      implicit val client = new OkHttpClient()
      new OphanService(new DefaultOphanService(HttpUrl.parse(config.ophanEndpoint)))
    }.leftMap { err =>
      InitializationError(s"unable to instantiate OphanService for config: ${config}. Error trace: ${err.getMessage}")
    }
  }
}
