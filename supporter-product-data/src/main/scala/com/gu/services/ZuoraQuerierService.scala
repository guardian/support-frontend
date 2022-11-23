package com.gu.services

import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.states.QueryType
import com.gu.model.states.QueryType.{Full, Incremental}
import com.gu.model.zuora.request.{BatchQueryRequest, ZoqlExportQuery}
import com.gu.model.zuora.response.{BatchQueryErrorResponse, BatchQueryResponse}
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import io.circe.syntax.EncoderOps

import java.time.format.DateTimeFormatter
import java.time.{LocalDate, LocalDateTime, ZonedDateTime}
import scala.collection.immutable.Map.empty
import scala.concurrent.{ExecutionContext, Future}

class ZuoraQuerierService(val config: ZuoraQuerierConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
    extends WebServiceHelper[BatchQueryErrorResponse] {

  override val wsUrl = config.url
  override val httpClient: FutureHttpClient = client
  val authHeaders = Map(
    "apiSecretAccessKey" -> config.password,
    "apiAccessKeyId" -> config.username,
    "Accept-Encoding" -> "identity", // Required to ensure that response content-length header is available. We need this when we transfer results to S3. See https://github.com/square/okhttp/issues/1542 for details
  )

  def postQuery(queryType: QueryType): Future[BatchQueryResponse] = {
    val (queries, incrementalTime) = queryType match {
      case Full =>
        (
          List(
            ZoqlExportQuery(
              s"${SelectActiveRatePlansQuery.name}-${LocalDateTime.now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)}",
              SelectActiveRatePlansQuery.query(config.discountProductRatePlanIds),
            ),
          ),
          Some(ZonedDateTime.now.minusYears(20)),
        ) // Because we are using a stateful query with incrementalTime, we use a date in the far past to get all records
      case Incremental => (List(), config.lastSuccessfulQueryTime)
    }
    val request = BatchQueryRequest(
      partner = config.partnerId,
      name = "supporter-product-data",
      queries = queries,
      incrementalTime = incrementalTime,
    )
    postJson[BatchQueryResponse](s"batch-query/", request.asJson, authHeaders)
  }

  def getResults(id: String): Future[BatchQueryResponse] =
    get[BatchQueryResponse](s"batch-query/jobs/$id", authHeaders)

  def getResultFileResponse(fileId: String) = {
    val endpoint = s"/batch-query/file/$fileId"
    getResponse(buildRequest(endpoint, authHeaders, empty))
  }

}
