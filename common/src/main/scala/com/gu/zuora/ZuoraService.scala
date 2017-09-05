package com.gu.zuora

import cats.implicits._
import cats.syntax.either._
import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.workers.model.BillingPeriod
import com.gu.zuora.model.response._
import com.gu.zuora.model.{QueryData, SubscribeRequest}
import io.circe
import io.circe.Decoder
import io.circe.parser.decode
import io.circe.syntax._
import okhttp3.Request.Builder

import scala.concurrent.{ExecutionContext, Future}

class ZuoraService(config: ZuoraConfig, client: FutureHttpClient, baseUrl: Option[String] = None)(implicit ec: ExecutionContext)
    extends WebServiceHelper[ZuoraErrorResponse] {

  override val wsUrl: String = baseUrl.getOrElse(config.url)
  override val httpClient: FutureHttpClient = client

  override def wsPreExecute(req: Builder): Builder =
    req //Add authentication information
      .addHeader("apiSecretAccessKey", config.password)
      .addHeader("apiAccessKeyId", config.username)

  def getAccount(accountNumber: String): Future[GetAccountResponse] =
    get[GetAccountResponse](s"accounts/$accountNumber")

  def getAccountIds(identityId: String): Future[List[String]] = {
    val queryData = QueryData(s"select AccountNumber from account where IdentityId__c = '${identityId.toLong}'")
    post[QueryResponse](s"action/query", queryData.asJson).map(_.records.map(_.AccountNumber))
  }

  def getSubscriptions(accountId: String): Future[List[Subscription]] =
    get[SubscriptionsResponse](s"subscriptions/accounts/$accountId").map(_.subscriptions)

  def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] =
    post[List[SubscribeResponseAccount]]("action/subscribe", subscribeRequest.asJson)

  def getRecurringSubscription(identityId: String, billingPeriod: BillingPeriod): Future[Option[Subscription]] =
    for {
      accountIds <- getAccountIds(identityId)
      subscriptions <- accountIds.map(getSubscriptions).combineAll
    } yield subscriptions.find(_.ratePlans.exists(_.productRatePlanId == config.configForBillingPeriod(billingPeriod).productRatePlanId))

  override def decodeError(responseBody: String)(implicit errorDecoder: Decoder[ZuoraErrorResponse]): Either[circe.Error, ZuoraErrorResponse] =
    //The Zuora api docs say that the subscribe action returns
    //a ZuoraErrorResponse but actually it returns a list of those.
    decode[List[ZuoraErrorResponse]](responseBody).map(_.head)

}
