package services

import cats.data.{EitherT, Validated}
import cats.implicits._
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.gu.acquisition.services.DefaultOphanService
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.typesafe.scalalogging.StrictLogging
import conf.OphanConfig
import model.{DefaultThreadPool, InitializationError, InitializationResult}
import okhttp3.{HttpUrl, OkHttpClient}

import scala.concurrent.Future

class OphanService(val ophanClient: DefaultOphanService)(implicit pool: DefaultThreadPool) extends StrictLogging {

  def submitAcquisition[A : AcquisitionSubmissionBuilder](acquisition: A):
  EitherT[Future, OphanServiceError, AcquisitionSubmission] = {
    logger.info(s"Sending acquisition event to ophan: ${acquisition.toString}")
    ophanClient.submit(acquisition).leftMap { error =>
      logger.error("Error sending acquisition.", error)
      error
    }
  }
}

object OphanService {
  def fromOphanConfig(config: OphanConfig)(implicit pool: DefaultThreadPool): InitializationResult[OphanService] = {
    Validated.catchNonFatal {
      implicit val client = new OkHttpClient()
      new OphanService(new DefaultOphanService(HttpUrl.parse(config.ophanEndpoint)))
    }.leftMap { err =>
      InitializationError(s"unable to instantiate OphanService for config: ${config}. Error trace: ${err.getMessage}")
    }
  }
}
