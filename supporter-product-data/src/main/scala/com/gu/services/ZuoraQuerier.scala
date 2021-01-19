package com.gu.services

import com.gu.model.zuora.request.{BatchQuery, ExportZoqlQueries, ZoqlExportQuery, ZuoraFieldNames}
import com.gu.model.zuora.response.{BatchQueryErrorResponse, BatchQueryResponse}
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import io.circe.syntax.EncoderOps

import java.time.{LocalDate, ZoneId}
import scala.concurrent.{ExecutionContext, Future}

case class ZuoraQuerierConfig(
  url: String,
  password: String,
  username: String
)

class ZuoraQuerierService(val config: ZuoraQuerierConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
  extends WebServiceHelper[BatchQueryErrorResponse] {

  override val wsUrl = config.url
  override val httpClient: FutureHttpClient = client
  val authHeaders = Map(
    "apiSecretAccessKey" -> config.password,
    "apiAccessKeyId" -> config.username
  )

  def postQuery(): Future[BatchQueryResponse] = {
    val query = BatchQuery(
      "SupporterProductData",
      List(
        ZoqlExportQuery("New Subscriptions",
          ExportZoqlQueries.selectNewRatePlans(LocalDate.now(ZoneId.of("UTC")))
        )
      )
    )
    postJson[BatchQueryResponse](s"action/query", query.asJson, authHeaders)
  }
}
