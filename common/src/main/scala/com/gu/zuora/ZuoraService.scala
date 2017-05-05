package com.gu.zuora

import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.zuora.model._
import io.circe.generic.auto._
import io.circe.syntax._
import okhttp3.Request.Builder

import scala.concurrent.{ExecutionContext, Future}

class ZuoraService(config: ZuoraConfig, client: FutureHttpClient)(implicit ec: ExecutionContext) extends WebServiceHelper[ZuoraResponse, ZuoraErrorResponse] with CustomCodecs {
  override val wsUrl = config.url
  override val httpClient = client

  override def wsPreExecute(req: Builder) = {
    req //Add authentication information
      .addHeader("apiSecretAccessKey", config.password)
      .addHeader("apiAccessKeyId", config.username)
  }

  def getAccount(accountNumber: String) =
    get[GetAccountResponse](s"accounts/$accountNumber")

  def subscribe(subscribeRequest: SubscribeRequest): Future[SubscribeResponse] =
    post[SubscribeResponse](s"action/subscribe", subscribeRequest.asJson)
}
