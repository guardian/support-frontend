package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.lambdas.ZuoraQuerierLambda.queryZuora
import com.gu.model.Stage
import com.gu.model.states.{ZuoraQuerierState, ZuoraResultsFetcherState}
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ZuoraQuerierService

import java.time.{LocalDate, ZoneId}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class ZuoraQuerierLambda extends Handler[ZuoraQuerierState, ZuoraResultsFetcherState] {

  override protected def handlerFuture(input: ZuoraQuerierState, context: Context) =
    queryZuora(Stage.fromEnvironment, LocalDate.now(ZoneId.of("UTC")))

}

object ZuoraQuerierLambda {
  def queryZuora(stage: Stage, date: LocalDate) = {
    SafeLogger.info(s"Attempting to submit query to Zuora")
    for {
      config <- ZuoraQuerierConfig.load(stage)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery(date)
    } yield {
      SafeLogger.info(s"Successfully submitted query with jobId ${result.id}")
      ZuoraResultsFetcherState(date, result.id)
    }
  }
}
