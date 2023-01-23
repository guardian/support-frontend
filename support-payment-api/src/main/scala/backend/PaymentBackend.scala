package backend

import backend.BackendError.SupporterProductDataError
import cats.data.EitherT
import cats.implicits._
import com.gu.support.acquisitions.ga.GoogleAnalyticsService
import com.gu.support.acquisitions.ga.models.GAData
import com.gu.support.acquisitions.{AcquisitionsStreamService, BigQueryService}
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.supporterdata.model.{ContributionAmount, SupporterRatePlanItem}
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.typesafe.scalalogging.StrictLogging
import model.DefaultThreadPool
import model.db.ContributionData
import services.{ContributionsStoreService, SupporterProductDataService}
import software.amazon.awssdk.services.dynamodb.model.UpdateItemResponse

import java.time.LocalDate
import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

trait PaymentBackend extends StrictLogging {
  val gaService: GoogleAnalyticsService
  val bigQueryService: BigQueryService
  val acquisitionsStreamService: AcquisitionsStreamService
  val databaseService: ContributionsStoreService
  val supporterProductDataService: SupporterProductDataService

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

    Future
      .sequence(
        List(gaFuture.value, bigQueryFuture.value, streamFuture.value, dbFuture.value, supporterDataFuture.value),
      )
      .map { results =>
        results.collect { case Left(err) => err }
      }
      .recover { case NonFatal(err) =>
        List(BackendError.TrackingError(err))
      }
  }
}
