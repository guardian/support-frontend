package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.lambdas.QueryZuoraLambda.queryZuora
import com.gu.model.Stage
import com.gu.model.states.{FetchResultsState, QueryType, QueryZuoraState}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.ZuoraQuerierService
import com.typesafe.scalalogging.StrictLogging

import java.time.LocalDateTime
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class QueryZuoraLambda extends Handler[QueryZuoraState, FetchResultsState] {

  override protected def handlerFuture(input: QueryZuoraState, context: Context) =
    queryZuora(Stage.fromEnvironment, input.queryType)

}

object QueryZuoraLambda extends StrictLogging {
  def queryZuora(stage: Stage, queryType: QueryType) = {
    logger.info(s"Attempting to submit ${queryType.value} query to Zuora")
    val attemptedQueryTime = LocalDateTime.now.minusMinutes(1)
    for {
      config <- ZuoraQuerierConfig.load(stage)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery(queryType)
    } yield {
      val fullOrIncremental = if (result.batches.headOption.exists(_.full)) "full" else "incremental"
      logger.info(s"Successfully submitted query with jobId ${result.id}, results will be $fullOrIncremental")
      FetchResultsState(result.id, attemptedQueryTime)
    }
  }
}
