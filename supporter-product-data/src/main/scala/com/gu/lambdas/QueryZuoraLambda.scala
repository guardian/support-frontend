package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.QueryZuoraLambda.queryZuora
import com.gu.model.Stage
import com.gu.model.states.{FetchResultsState, QueryType, QueryZuoraState}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{ConfigService, ZuoraQuerierService}
import com.typesafe.scalalogging.StrictLogging

import java.time.{ZoneId, ZonedDateTime}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class QueryZuoraLambda extends Handler[QueryZuoraState, FetchResultsState] {

  override protected def handlerFuture(input: QueryZuoraState, context: Context) =
    queryZuora(Stage.fromEnvironment, input.queryType)

}

object QueryZuoraLambda extends StrictLogging {
  def queryZuora(stage: Stage, queryType: QueryType) = {
    logger.info(s"Attempting to submit ${queryType.value} query to Zuora")

    // Get the time we started the query. Docs for why we need to do this are here:
    // https://knowledgecenter.zuora.com/Central_Platform/API/AB_Aggregate_Query_API/B_Submit_Query/e_Post_Query_with_Retrieval_Time
    val attemptedQueryTime = ZonedDateTime.now(ZoneId.of("America/Los_Angeles")).minusMinutes(1)

    for {
      config <- ConfigService(stage).load
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.postQuery(queryType)
    } yield {
      val fullOrIncremental = if (result.batches.headOption.exists(_.full)) "full" else "incremental"
      logger.info(s"Successfully submitted query with jobId ${result.id}, results will be $fullOrIncremental")
      FetchResultsState(result.id, attemptedQueryTime)
    }
  }
}
