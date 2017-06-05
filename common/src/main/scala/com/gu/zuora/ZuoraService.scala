package com.gu.zuora

import cats.syntax.either._
import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.zuora.model._
import io.circe
import io.circe.Decoder
import io.circe.parser.decode
import io.circe.syntax._
import okhttp3.Request.Builder

import scala.concurrent.{ExecutionContext, Future}

class ZuoraService(config: ZuoraConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
  extends WebServiceHelper[ZuoraErrorResponse] {

  override val wsUrl = config.url
  override val httpClient = client

  override def wsPreExecute(req: Builder): Builder =
    req //Add authentication information
      .addHeader("apiSecretAccessKey", config.password)
      .addHeader("apiAccessKeyId", config.username)

  def getAccount(accountNumber: String): Future[GetAccountResponse] =
    get[GetAccountResponse](s"accounts/$accountNumber")

  def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] =
    post[List[SubscribeResponseAccount]](s"action/subscribe", subscribeRequest.asJson)

  override def decodeError(responseBody: String)(implicit errorDecoder: Decoder[ZuoraErrorResponse]):
  Either[circe.Error, ZuoraErrorResponse] =
  //The Zuora api docs say that the subscribe action returns
  //a ZuoraErrorResponse but actually it returns a list of those.
    decode[List[ZuoraErrorResponse]](responseBody).map(_.head)

}
