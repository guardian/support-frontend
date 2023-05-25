package backend

import backend.BackendError.SupporterProductDataError
import cats.data.EitherT
import cats.implicits._
import com.gu.support.acquisitions.ga.GoogleAnalyticsService
import com.gu.support.acquisitions.ga.models.GAData
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.acquisitions.{AcquisitionsStreamService, BigQueryService}
import com.typesafe.scalalogging.StrictLogging
import model.DefaultThreadPool
import model.db.ContributionData
import services.{ContributionsStoreService, SoftOptInsService, SupporterProductDataService, SwitchService}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

trait PaymentBackend extends StrictLogging {
  val gaService: GoogleAnalyticsService
  val bigQueryService: BigQueryService
  val acquisitionsStreamService: AcquisitionsStreamService
  val databaseService: ContributionsStoreService
  val supporterProductDataService: SupporterProductDataService
  val softOptInsService: SoftOptInsService
  val switchService: SwitchService
  private def softOptInsEnabled()(implicit executionContext: ExecutionContext): EitherT[Future, Nothing, Boolean] =
    switchService.allSwitches.map(switch =>
      switch.featureSwitches.exists(s => s.switches.enableSoftOptInsForSingle.state.isOn),
    )

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

  def track(acquisition: AcquisitionDataRow, contributionData: ContributionData, gaData: GAData)(implicit
      pool: DefaultThreadPool,
  ): Future[List[BackendError]] = {
    val gaFuture = gaService
      .submit(acquisition, gaData, maxRetries = 5)
      .leftMap(errors => BackendError.GoogleAnalyticsError(errors.mkString(" & ")))

    val bigQueryFuture =
      bigQueryService
        .tableInsertRowWithRetry(acquisition, maxRetries = 5)
        .leftMap(errors => BackendError.BigQueryError(errors.mkString(" & ")))
    val streamFuture = acquisitionsStreamService
      .putAcquisitionWithRetry(acquisition, maxRetries = 5)
      .leftMap(errors => BackendError.AcquisitionsStreamError(errors.mkString(" & ")))

    val dbFuture = insertContributionDataIntoDatabase(contributionData)

    val supporterDataFuture = insertContributionIntoSupporterProductData(contributionData)

    val softOptInFuture = softOptInsEnabled().flatMap {
      case true =>
        softOptInsService.sendMessage(contributionData.identityId, contributionData.contributionId.toString)
      case false =>
        EitherT.rightT[Future, BackendError.SoftOptInsServiceError](())
    }

    Future
      .sequence(
        List(
          gaFuture.value,
          bigQueryFuture.value,
          streamFuture.value,
          dbFuture.value,
          supporterDataFuture.value,
          softOptInFuture.value,
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
