package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.FetchResultsLambda.fetchResults
import com.gu.model.StageConstructors
import com.gu.model.states.{FetchResultsState, UpdateDynamoState}
import com.gu.model.zuora.response.JobStatus.Completed
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{ConfigService, S3Service, ZuoraQuerierService}
import com.gu.supporterdata.model.Stage
import com.typesafe.scalalogging.StrictLogging

import java.time.{ZoneOffset, ZonedDateTime}
import java.time.format.DateTimeFormatter
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.DurationInt

class FetchResultsLambda extends Handler[FetchResultsState, UpdateDynamoState] {
  override protected def handlerFuture(input: FetchResultsState, context: Context) =
    fetchResults(StageConstructors.fromEnvironment, input.jobId, input.attemptedQueryTime)
}

object FetchResultsLambda extends StrictLogging {
  def fetchResults(stage: Stage, jobId: String, attemptedQueryTime: ZonedDateTime) = {
    logger.info(s"Attempting to fetch results for jobId $jobId")
    for {
      config <- ConfigService(stage).load
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.getResults(jobId)
      _ = assert(result.status == Completed, s"Job with id $jobId is still in status ${result.status}")
      batch = getValueOrThrow(
        result.batches.headOption,
        s"No batches were returned in the batch query response for jobId $jobId",
      )
      fileId = getValueOrThrow(batch.fileId, s"Batch.fileId was missing in jobId $jobId")
      filename = s"select-active-rate-plans-${attemptedQueryTime.withZoneSameInstant(ZoneOffset.UTC).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)}.csv"
      fileResponse <- service.getResultFileResponse(fileId)
      _ = assert(
        fileResponse.isSuccessful,
        s"File download for job with id $jobId failed with http code ${fileResponse.code}",
      )
      _ <- S3Service.streamToS3(stage, filename, fileResponse.body.byteStream, fileResponse.body.contentLength)
    } yield {
      logger.info(s"Successfully wrote file $filename to S3 with ${batch.recordCount} records for jobId $jobId")
      if (batch.recordCount == 0)
        ConfigService(stage).putLastSuccessfulQueryTime(attemptedQueryTime)

      UpdateDynamoState(
        filename,
        batch.recordCount,
        processedCount = 0,
        attemptedQueryTime,
      )
    }
  }

  def getValueOrThrow[T](maybeValue: Option[T], errorMessage: String) =
    maybeValue match {
      case Some(value) => value
      case None => throw new RuntimeException(errorMessage)
    }
}
