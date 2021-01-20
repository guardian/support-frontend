package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage
import com.gu.model.states.{ZuoraQuerierState, ZuoraResultsFetcherState}
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ZuoraQuerierService

import java.time.{LocalDate, ZoneId}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class ZuoraQuerierLambda extends Handler[ZuoraQuerierState, ZuoraResultsFetcherState] {

  override protected def handlerFuture(input: ZuoraQuerierState, context: Context) = {
    val stage = Stage.fromEnvironment
    val today = LocalDate.now(ZoneId.of("UTC"))
    SafeLogger.info(s"Attempting to submit query to Zuora")
    for {
      config <- ZuoraQuerierConfig.load(stage)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery(today)
    } yield {
      SafeLogger.info(s"Successfully submitted query with jobId ${result.id}")
      ZuoraResultsFetcherState(today, result.id)
    }
  }

}
