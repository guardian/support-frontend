package com.gu.lambdas

import com.gu.lambdas.FetchResultsLambda.getValueOrThrow
import com.gu.lambdas.RunFullExportSpec.sleep
import com.gu.supporterdata.model.Stage._
import com.gu.model.states.QueryType._
import com.gu.model.states.AddSupporterRatePlanItemToQueueState
import com.gu.model.zuora.response.BatchQueryResponse
import com.gu.model.zuora.response.JobStatus.Completed
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{ConfigService, ZuoraQuerierService}
import com.gu.supporterdata.model.Stage
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.io.{File, PrintWriter}
import java.nio.file.{FileSystems, Files, StandardCopyOption}
import java.time.{LocalDateTime, ZoneId, ZonedDateTime}
import scala.concurrent.Future
import scala.concurrent.duration._
import scala.io.Source

@IntegrationTest
class RunFullExportSpec extends AsyncFlatSpec with Matchers with LazyLogging {
  val stage = PROD
  val queryType = Full
  val sanitizeFieldNamesAfterDownload = false
  val updateLastSuccessfulQueryTime = false

  "This test is just an easy way to run an aqua query. It" should "save the results to a csv in supporter-product-data/data-extracts" ignore {
    val attemptedQueryTime =
      LocalDateTime.parse("2021-03-15T16:27:02.429").atZone(ZoneId.of("America/Los_Angeles")).minusMinutes(1)
    for {
      fetchResultsState <- QueryZuoraLambda.queryZuora(stage, queryType)
      addSupporterRatePlanItemToQueueState <- fetchResults(
        stage,
        fetchResultsState.jobId,
        fetchResultsState.attemptedQueryTime,
      )
      _ <-
        if (updateLastSuccessfulQueryTime) ConfigService(stage).putLastSuccessfulQueryTime(attemptedQueryTime)
        else Future.successful(())
    } yield addSupporterRatePlanItemToQueueState.filename should endWith(".csv")
  }

  def fetchResults(
      stage: Stage,
      jobId: String,
      attemptedQueryTime: ZonedDateTime,
  ): Future[AddSupporterRatePlanItemToQueueState] = {
    logger.info(s"Attempting to fetch results for jobId $jobId")
    sleep(20 * 1000)
    for {
      config <- ConfigService(stage).load
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.getResults(jobId)
      finalState <-
        if (result.status == Completed)
          downloadResults(result, service)
        else
          fetchResults(stage, jobId, attemptedQueryTime)
    } yield {
      finalState
    }
  }

  def downloadResults(result: BatchQueryResponse, service: ZuoraQuerierService) = {
    val batch = getValueOrThrow(result.batches.headOption, s"No batches were returned in the batch query response")
    val fileId = getValueOrThrow(batch.fileId, s"Batch.fileId was missing in the job")
    for {
      fileResponse <- service.getResultFileResponse(fileId)
      _ = assert(fileResponse.isSuccessful, s"File download for job failed with http code ${fileResponse.code}")
      filePath = FileSystems.getDefault.getPath(
        System.getProperty("user.dir"),
        "supporter-product-data",
        "data-extracts",
        s"last-$queryType-$stage.csv",
      )
      _ = Files.copy(fileResponse.body.byteStream, filePath, StandardCopyOption.REPLACE_EXISTING)
      _ = if (sanitizeFieldNamesAfterDownload) sanitizeFieldNames(filePath.toString)
    } yield {
      logger.info(s"Successfully wrote file $filePath with ${batch.recordCount} records")
      AddSupporterRatePlanItemToQueueState(
        filePath.toString,
        batch.recordCount,
        processedCount = 0,
        ZonedDateTime.now,
      )
    }
  }

  def sanitizeFieldNames(filename: String) = {
    val tempPath = FileSystems.getDefault.getPath(
      System.getProperty("user.dir"),
      "supporter-product-data",
      "data-extracts",
      "temp.csv",
    )
    val tempFile = new File(tempPath.toString)
    val writer = new PrintWriter(tempFile)

    val fileSource = Source.fromFile(filename)
    fileSource.getLines.zipWithIndex
      .map { case (line, lineNumber) =>
        if (lineNumber == 0)
          line.replace(".", "_").replace("__c", "")
        else
          line
      }
      .foreach(x => writer.println(x))
    writer.close()
    fileSource.close
    tempFile.renameTo(new File(filename))
  }
}

object RunFullExportSpec {
  def sleep(millis: Int): Future[Unit] = {
    Thread.sleep(millis)
    Future.successful(())
  }
}
