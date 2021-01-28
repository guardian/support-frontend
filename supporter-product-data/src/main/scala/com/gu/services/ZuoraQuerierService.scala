package com.gu.services

import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.states.QueryType
import com.gu.model.states.QueryType.{Full, Incremental}
import com.gu.model.zuora.request.{BatchQueryRequest, ZoqlExportQuery}
import com.gu.model.zuora.response.{BatchQueryErrorResponse, BatchQueryResponse}
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import io.circe.syntax.EncoderOps

import java.time.{LocalDate, ZoneId, ZoneOffset}
import scala.collection.Map.empty
import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.classTag

class ZuoraQuerierService(val config: ZuoraQuerierConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
  extends WebServiceHelper[BatchQueryErrorResponse] {

  override val wsUrl = config.url
  override val httpClient: FutureHttpClient = client
  val authHeaders = Map(
    "apiSecretAccessKey" -> config.password,
    "apiAccessKeyId" -> config.username
  )

  def postQuery(queryType: QueryType): Future[BatchQueryResponse] = {
    val query = queryType match {
      case Full => SelectActiveRatePlansQuery.fullQuery(LocalDate.now(ZoneId.of("UTC")))
      case Incremental => SelectActiveRatePlansQuery.incrementalQuery
    }
    val request = BatchQueryRequest(
      config.partnerId,
      "supporter-product-data",
      List(
        ZoqlExportQuery(
          SelectActiveRatePlansQuery.name,
          query
        )
      )
    )
    postJson[BatchQueryResponse](s"batch-query/", request.asJson, authHeaders)
  }

  def getResults(id: String): Future[BatchQueryResponse] =
    get(s"batch-query/jobs/$id", authHeaders)(
      BatchQueryResponse.decoder, // having to explicitly pass these implicits or the compiler gets confused by ambiguous implicit values
      BatchQueryErrorResponse.decoder,
      classTag[BatchQueryResponse]
    )

  def getResultFileResponse(fileId: String) = {
    val endpoint = s"/batch-query/file/$fileId"
    getResponse(buildRequest(endpoint, authHeaders, empty))
  }

}
