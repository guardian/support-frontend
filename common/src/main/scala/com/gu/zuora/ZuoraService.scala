package com.gu.zuora

import cats.syntax.either._
import com.gu.config.Configuration
import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.zuora.model._
import com.gu.zuora.model.response._
import io.circe
import io.circe.Decoder
import io.circe.parser.decode
import io.circe.syntax._
import okhttp3.Request.Builder

import scala.concurrent.{ExecutionContext, Future}

class ZuoraService(config: ZuoraConfig, client: FutureHttpClient, baseUrl: Option[String] = None)(implicit ec: ExecutionContext)
  extends WebServiceHelper[ZuoraErrorResponse] {

  override val wsUrl = baseUrl.getOrElse(config.url)
  override val httpClient = client

  override def wsPreExecute(req: Builder): Builder =
    req //Add authentication information
      .addHeader("apiSecretAccessKey", config.password)
      .addHeader("apiAccessKeyId", config.username)

  def getAccount(accountNumber: String): Future[GetAccountResponse] =
    get[GetAccountResponse](s"accounts/$accountNumber")

  def getAccountIds(identityId: String): Future[List[AccountRecord]] = {
    val queryData = QueryData(s"select AccountNumber from account where IdentityId__c = '$identityId'")
    post[QueryResponse](s"action/query", queryData.asJson).map(_.records)
  }

  def getSubscriptions(accountId: String): Future[SubscriptionsResponse] =
    get[SubscriptionsResponse](s"subscriptions/accounts/$accountId")

  def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] =
    post[List[SubscribeResponseAccount]](s"action/subscribe", subscribeRequest.asJson)

  def userIsContributor(identityId: String): Future[Boolean] = {
    val rp = for {
      accounts <- getAccountIds(identityId)
      subs <- accounts.map(getSubscriptions(i => i)
      sub <- subs.subscriptions
    } yield {
      sub
    }
  }

//  def userIsContributor2(identityId: String): Any = {
//    for
//    getAccountIds(identityId).map {
//      l =>
//        l.map(a => getSubscriptions(a.AccountNumber)).map{
//
//        }
//    }
//
//  }

  override def decodeError(responseBody: String)(implicit errorDecoder: Decoder[ZuoraErrorResponse]): Either[circe.Error, ZuoraErrorResponse] =
  //The Zuora api docs say that the subscribe action returns
  //a ZuoraErrorResponse but actually it returns a list of those.
    decode[List[ZuoraErrorResponse]](responseBody).map(_.head)

}
