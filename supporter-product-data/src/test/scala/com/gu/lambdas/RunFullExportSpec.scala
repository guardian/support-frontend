package com.gu.lambdas

import com.gu.lambdas.FetchResultsLambda.getValueOrThrow
import com.gu.lambdas.RunFullExportSpec.sleep
import com.gu.model.Stage
import com.gu.model.Stage.PROD
import com.gu.model.states.QueryType.Full
import com.gu.model.states.UpdateDynamoState
import com.gu.model.zuora.response.BatchQueryResponse
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
import scala.annotation.tailrec
import scala.concurrent.Future
import scala.concurrent.duration._
import scala.io.Source

@IntegrationTest
class RunFullExportSpec extends AsyncFlatSpec with Matchers with LazyLogging {
  val stage = PROD

  "This test is just an easy way to run an aqua query. It" should "save the results to a csv in supporter-product-data/data-extracts" in {
    for {
      fetchResultsState <- QueryZuoraLambda.queryZuora(stage, Full)
      updateDynamoState <- fetchResults(stage, fetchResultsState.jobId, fetchResultsState.attemptedQueryTime)
    } yield updateDynamoState.filename should endWith("last-extract.csv")
  }

  def fetchResults(stage: Stage, jobId: String, attemptedQueryTime: ZonedDateTime): Future[UpdateDynamoState] = {
    logger.info(s"Attempting to fetch results for jobId $jobId")
    sleep(20 * 1000)
    for {
      config <- ConfigService(stage).load
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.getResults(jobId)
      finalState <- if (result.status == Completed)
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
       filePath = FileSystems.getDefault.getPath(System.getProperty("user.dir"), "supporter-product-data", "data-extracts", "last-extract.csv")
       _ = Files.copy(fileResponse.body.byteStream, filePath, StandardCopyOption.REPLACE_EXISTING)
       _ = sanitizeFieldNames(filePath.toString)
    } yield {
      logger.info(s"Successfully wrote file $filePath with ${batch.recordCount} records")
      UpdateDynamoState(
        filePath.toString,
        batch.recordCount,
        processedCount = 0,
        ZonedDateTime.now
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
