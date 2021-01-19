package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage
import com.gu.model.states.{ZuoraQuerierState, ZuoraResultsFetcherState}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ZuoraQuerierService

import java.time.{LocalDate, ZoneId}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class ZuoraQuerierLambda extends Handler[ZuoraQuerierState, ZuoraResultsFetcherState] {

  override protected def handlerFuture(input: ZuoraQuerierState, context: Context) = {
    val stage = Stage.fromEnvironment
    val today = LocalDate.now(ZoneId.of("UTC"))
    for {
      config <- ZuoraQuerierConfig.load(stage)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery(today)
    } yield ZuoraResultsFetcherState(today, result.id)
  }

}
