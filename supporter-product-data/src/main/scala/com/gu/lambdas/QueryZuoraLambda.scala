package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.lambdas.QueryZuoraLambda.queryZuora
import com.gu.model.Stage
import com.gu.model.states.{QueryZuoraState, FetchResultsState}
import com.gu.model.zuora.request.ExportZoqlQueryObject
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ZuoraQuerierService

import java.time.{LocalDate, ZoneId}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class QueryZuoraLambda extends Handler[QueryZuoraState, FetchResultsState] {

  override protected def handlerFuture(input: QueryZuoraState, context: Context) =
    queryZuora(Stage.fromEnvironment, input.query, LocalDate.now(ZoneId.of("UTC")))

}

object QueryZuoraLambda {
  def queryZuora(stage: Stage, query: ExportZoqlQueryObject, date: LocalDate) = {
    SafeLogger.info(s"Attempting to submit ${query.name} query to Zuora")
    for {
      config <- ZuoraQuerierConfig.load(stage)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery(query, date)
    } yield {
      SafeLogger.info(s"Successfully submitted query with jobId ${result.id}")
      ZuoraResultsFetcherState(query, result.id)
    }
  }
}
