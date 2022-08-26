package com.gu.services

import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.states.QueryType
import com.gu.model.states.QueryType.{Full, Incremental}
import com.gu.model.zuora.request.{BatchQueryRequest, ZoqlExportQuery}
import com.gu.model.zuora.response.{BatchQueryErrorResponse, BatchQueryResponse, MinimalZuoraSubscription}
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import io.circe.syntax.EncoderOps

import java.time.format.DateTimeFormatter
import java.time.{LocalDateTime, ZonedDateTime}
import scala.collection.immutable.Map.empty
import scala.concurrent.{ExecutionContext, Future}

class ZuoraSubscriptionService(val config: ZuoraQuerierConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
    extends WebServiceHelper[BatchQueryErrorResponse] {

  override val wsUrl = config.url
  override val httpClient: FutureHttpClient = client
  val authHeaders = Map(
    "apiSecretAccessKey" -> config.password,
    "apiAccessKeyId" -> config.username,
  )

  def getSubscription(id: String): Future[MinimalZuoraSubscription] =
    get[MinimalZuoraSubscription](s"subscriptions/$id", authHeaders)

}
