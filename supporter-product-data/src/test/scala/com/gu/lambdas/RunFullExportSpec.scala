package com.gu.lambdas

import com.gu.lambdas.FetchResultsLambda.getValueOrThrow
import com.gu.lambdas.RunFullExportSpec.sleep
import com.gu.model.Stage
import com.gu.model.Stage.PROD
import com.gu.model.states.QueryType.Full
import com.gu.model.states.UpdateDynamoState
import com.gu.model.zuora.response.JobStatus.Completed
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{ConfigService, ZuoraQuerierService}
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.io.{File, PrintWriter}
import java.nio.file.{FileSystems, Files, StandardCopyOption}
import java.time.ZonedDateTime
import scala.concurrent.Future
import scala.concurrent.duration._
import scala.io.Source

@IntegrationTest
class RunFullExportSpec extends AsyncFlatSpec with Matchers with LazyLogging {
  val stage = PROD

  "This test is just an easy way to run an aqua query. It" should "save the results to a csv in supporter-product-data/data-extracts" in {
    for {
      fetchResultsState <- QueryZuoraLambda.queryZuora(stage, Full)
      _ <- sleep(45 * 1000)
      updateDynamoState <- fetchResults(stage, fetchResultsState.jobId, fetchResultsState.attemptedQueryTime)
    } yield updateDynamoState.filename should endWith ("last-extract.csv")
  }

  def fetchResults(stage: Stage, jobId: String, attemptedQueryTime: ZonedDateTime) = {
    logger.info(s"Attempting to fetch results for jobId $jobId")
    for {
      config <- ConfigService(stage).load
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.getResults(jobId)
      _ = assert(result.status == Completed, s"Job with id $jobId is still in status ${result.status}")
      batch = getValueOrThrow(result.batches.headOption, s"No batches were returned in the batch query response for jobId $jobId")
      fileId = getValueOrThrow(batch.fileId, s"Batch.fileId was missing in jobId $jobId")
      fileResponse <- service.getResultFileResponse(fileId)
      _ = assert(fileResponse.isSuccessful, s"File download for job with id $jobId failed with http code ${fileResponse.code}")
      filePath = FileSystems.getDefault.getPath(System.getProperty("user.dir"), "supporter-product-data", "data-extracts", "last-extract.csv")
      _ = Files.copy(fileResponse.body.byteStream, filePath, StandardCopyOption.REPLACE_EXISTING)
      _ = sanitizeFieldNames(filePath.toString)
    } yield {
      logger.info(s"Successfully wrote file $filePath to S3 with ${batch.recordCount} records for jobId $jobId")
      UpdateDynamoState(
        filePath.toString,
        batch.recordCount,
        processedCount = 0,
        attemptedQueryTime
      )
    }
  }

  def sanitizeFieldNames(filename: String) = {
    val tempPath = FileSystems.getDefault.getPath(System.getProperty("user.dir"), "supporter-product-data", "data-extracts", "temp.csv")
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
