package com.gu.lambdas

import com.gu.lambdas.RunFullExportSpec.sleep
import com.gu.model.Stage.{DEV, PROD, UAT}
import com.gu.model.states.QueryType.{Full, Incremental}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

@IntegrationTest
class RunFullExportSpec extends AsyncFlatSpec with Matchers {
  QueryZuoraLambda.getClass.getSimpleName should "be able to run a query" in {
    val stage = PROD
    for {
      fetchResultsState <- QueryZuoraLambda.queryZuora(stage, Full)
      _ <- sleep(30000)
      updateDynamoState <- FetchResultsLambda.fetchResults(stage, fetchResultsState.jobId, fetchResultsState.attemptedQueryTime)
    } yield updateDynamoState.filename should startWith ("select-active-rate-plans")
  }
}

object RunFullExportSpec {
  def sleep(millis: Int): Future[Unit] = {
    Thread.sleep(millis)
    Future.successful(())
  }
}
