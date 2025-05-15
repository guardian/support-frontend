package backend

import backend.BackendError.SupporterProductDataError
import cats.data.EitherT
import cats.implicits._
import com.gu.support.acquisitions.eventbridge.AcquisitionsEventBusService
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.typesafe.scalalogging.StrictLogging
import model.DefaultThreadPool
import model.db.ContributionData
import services.{ContributionsStoreService, SupporterProductDataService, SwitchService}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

trait PaymentBackend extends StrictLogging {
  val acquisitionsEventBusService: AcquisitionsEventBusService
  val databaseService: ContributionsStoreService
  val supporterProductDataService: SupporterProductDataService
  val switchService: SwitchService

  private def insertContributionDataIntoDatabase(
      contributionData: ContributionData,
  )(implicit pool: DefaultThreadPool): EitherT[Future, BackendError, Unit] = {
    // log so that if something goes wrong we can reconstruct the missing data from the logs
    logger.info(s"about to insert contribution into database: $contributionData")
    databaseService
      .insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)
  }

  private def insertContributionIntoSupporterProductData(
      contributionData: ContributionData,
  )(implicit executionContext: ExecutionContext): EitherT[Future, SupporterProductDataError, Unit] = {
    logger.info(s"about to insert contribution into SupporterProductData Dynamo store: $contributionData")
    supporterProductDataService
      .insertContributionData(contributionData)
      .leftMap(SupporterProductDataError)
  }

  def track(acquisition: AcquisitionDataRow, contributionData: ContributionData)(implicit
      pool: DefaultThreadPool,
  ): Future[List[BackendError]] = {

    val acquisitionEventFuture = EitherT(acquisitionsEventBusService.putAcquisitionEvent(acquisition))
      .leftMap(errorMessage => BackendError.AcquisitionsEventBusError(errorMessage))

    val dbFuture = insertContributionDataIntoDatabase(contributionData)

    val supporterDataFuture = insertContributionIntoSupporterProductData(contributionData)

    Future
      .sequence(
        List(
          acquisitionEventFuture.value,
          dbFuture.value,
          supporterDataFuture.value,
        ),
      )
      .map { results =>
        results.collect { case Left(err) => err }
      }
      .recover { case NonFatal(err) =>
        List(BackendError.TrackingError(err))
      }
  }
}
