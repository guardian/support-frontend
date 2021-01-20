package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage
import com.gu.model.states.{ZuoraResultsFetcherEndState, ZuoraResultsFetcherState}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{S3Service, ZuoraQuerierService}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.DurationInt

class ZuoraResultsFetcherLambda extends Handler[ZuoraResultsFetcherState, ZuoraResultsFetcherEndState]{
  override protected def handlerFuture(input: ZuoraResultsFetcherState, context: Context) = {
    val stage = Stage.fromEnvironment
    for {
      config <- ZuoraQuerierConfig.load(stage)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.getResults(input.jobId)
      batch = result.batches.head
      filename = s"${batch.name}-${batch.fileId}"
      fileStream <- service.getResultFileStream(batch.fileId)
      _ <- S3Service.streamToS3(filename, fileStream)
    } yield ZuoraResultsFetcherEndState(filename, batch.recordCount)
  }

}
