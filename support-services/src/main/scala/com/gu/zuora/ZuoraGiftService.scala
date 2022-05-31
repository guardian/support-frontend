package com.gu.zuora

import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.{Stage, ZuoraConfig}
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.zuora.api.response.{
  Subscription,
  SubscriptionRedemptionQueryResponse,
  ZuoraErrorResponse,
  ZuoraSuccessOrFailureResponse,
}
import com.gu.support.zuora.api.{Day, QueryData, UpdateRedemptionDataRequest}
import io.circe.syntax.EncoderOps
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

trait ZuoraGiftLookupService extends TouchpointService {
  def getSubscriptionFromRedemptionCode(redemptionCode: RedemptionCode): Future[SubscriptionRedemptionQueryResponse]
}

class ZuoraGiftService(val config: ZuoraConfig, stage: Stage, client: FutureHttpClient)(implicit ec: ExecutionContext)
    extends WebServiceHelper[ZuoraErrorResponse]
    with ZuoraGiftLookupService {

  override val wsUrl: String = config.url
  override val httpClient: FutureHttpClient = client
  val authHeaders = Map(
    "apiSecretAccessKey" -> config.password,
    "apiAccessKeyId" -> config.username,
  )

  override def getSubscriptionFromRedemptionCode(
      redemptionCode: RedemptionCode,
  ): Future[SubscriptionRedemptionQueryResponse] = {
    val queryData = QueryData(
      s"""
        select id, contractEffectiveDate, CreatedRequestId__c, GifteeIdentityId__c
        from subscription
        where RedemptionCode__c = '${redemptionCode.value}' and status = 'Active'""",
    )
    postJson[SubscriptionRedemptionQueryResponse](s"action/query", queryData.asJson, authHeaders)
  }

  def getSubscriptionById(id: String): Future[Subscription] = get[Subscription](s"subscriptions/${id}", authHeaders)

  def updateSubscriptionRedemptionData(
      subscriptionId: String,
      requestId: String,
      gifteeIdentityId: String,
      giftRedemptionDate: LocalDate,
      newTermLength: Int,
  ): Future[ZuoraSuccessOrFailureResponse] = {
    val requestData = UpdateRedemptionDataRequest(requestId, gifteeIdentityId, giftRedemptionDate, newTermLength, Day)
    val response =
      putJson[ZuoraSuccessOrFailureResponse](s"subscriptions/${subscriptionId}", requestData.asJson, authHeaders)
    response.transform {
      case Success(successfulResponse) if successfulResponse.success =>
        SafeLogger.info(
          s"Successfully updated gifteeIdentityId on Digital Subscription gift for user $gifteeIdentityId",
        )
        Success(successfulResponse)
      case Success(failedResponse) =>
        // Treat a ZuoraResponse where success = false as a failure
        val responseMessage = failedResponse.errorMessage.getOrElse("unknown")
        val errorMessage =
          s"Failed to update gifteeIdentityId on Digital Subscription gift for user $gifteeIdentityId. Error was ${responseMessage}"
        Failure(new RuntimeException(errorMessage))
      case Failure(originalError) =>
        val errorMessage = s"Failed to update gifteeIdentityId on Digital Subscription gift for user $gifteeIdentityId."
        Failure(new RuntimeException(errorMessage, originalError))
    }
  }
}
