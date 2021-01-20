package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage
import com.gu.model.states.{ZuoraResultsFetcherEndState, ZuoraResultsFetcherState}
import com.gu.model.zuora.response.JobStatus.Completed
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{S3Service, ZuoraQuerierService}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.DurationInt

class ZuoraResultsFetcherLambda extends Handler[ZuoraResultsFetcherState, ZuoraResultsFetcherEndState]{
  override protected def handlerFuture(input: ZuoraResultsFetcherState, context: Context) = {
    val stage = Stage.fromEnvironment
    SafeLogger.info(s"Attempting to fetch results for jobId ${input.jobId}")
    for {
      config <- ZuoraQuerierConfig.load(stage)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.getResults(input.jobId)
      _ = assert(result.status == Completed, s"Job with id ${input.jobId} is still in status ${result.status}")
      batch = result.batches.headOption.toRight(s"No batches were returned in the batch query response for jobId ${input.jobId}").right.get
      fileId = batch.fileId.toRight(s"Batch.fileId was missing in jobId ${input.jobId}").right.get
      filename = s"${batch.name}-$fileId"
      fileResponse <- service.getResultFileResponse(fileId)
      _ = assert(fileResponse.isSuccessful, s"File download for job with id ${input.jobId} failed with http code ${fileResponse.code}")
      _ <- S3Service.streamToS3(filename, fileResponse.body.byteStream, fileResponse.body.contentLength)
    } yield {
      SafeLogger.info(s"Successfully wrote file $filename to S3 with ${batch.recordCount} records for jobId ${input.jobId}")
      ZuoraResultsFetcherEndState(filename, batch.recordCount)
    }
  }

}
