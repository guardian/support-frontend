package com.gu.zuora

import cats.data.OptionT
import cats.implicits.catsStdInstancesForFuture
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.ZuoraConfig
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.workers.states.SendThankYouEmailState.TermDates
import com.gu.support.zuora.api.{Day, DistributeRevenueRequest, QueryData, UpdateRedemptionDataRequest}
import com.gu.support.zuora.api.response.{RevenueSchedulesResponse, Subscription, SubscriptionRedemptionQueryResponse, ZuoraErrorResponse, ZuoraResponse, ZuoraSuccessOrFailureResponse}
import io.circe.syntax.EncoderOps
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

trait ZuoraGiftLookupService extends TouchpointService {
  def getSubscriptionFromRedemptionCode(redemptionCode: RedemptionCode): Future[SubscriptionRedemptionQueryResponse]
}

class ZuoraGiftService(val config: ZuoraConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
  extends WebServiceHelper[ZuoraErrorResponse] with ZuoraGiftLookupService {

  override val wsUrl: String = config.url
  override val httpClient: FutureHttpClient = client
  val authHeaders = Map(
    "apiSecretAccessKey" -> config.password,
    "apiAccessKeyId" -> config.username
  )

  override def getSubscriptionFromRedemptionCode(redemptionCode: RedemptionCode): Future[SubscriptionRedemptionQueryResponse] = {
    val queryData = QueryData(
      s"""
        select id, contractEffectiveDate, CreatedRequestId__c, GifteeIdentityId__c
        from subscription
        where RedemptionCode__c = '${redemptionCode.value}' and status = 'Active'"""
    )
    postJson[SubscriptionRedemptionQueryResponse](s"action/query", queryData.asJson, authHeaders)
  }

  def getSubscriptionById(id: String): Future[Subscription] = get[Subscription](s"subscriptions/${id}", authHeaders)

  def updateSubscriptionRedemptionData(
    subscriptionId: String,
    requestId: String,
    gifteeIdentityId: String,
    giftRedemptionDate: LocalDate,
    newTermLength: Int
  ): Future[ZuoraSuccessOrFailureResponse] = {
    val requestData = UpdateRedemptionDataRequest(requestId, gifteeIdentityId, giftRedemptionDate, newTermLength, Day)
    putJson[ZuoraSuccessOrFailureResponse](s"subscriptions/${subscriptionId}", requestData.asJson, authHeaders)
  }

  def setupRevenueRecognition(
    subscription: Subscription,
    termDates: TermDates
  ) = {
    //This doc describes what this method is doing: https://docs.google.com/document/d/1yNeaR2l1Ss_unXygntuntmRX-GicDelryuK25vmqToc/edit
    (for {
      ratePlan <- OptionT.fromOption(subscription.ratePlans.headOption)
      ratePlanChargeId <- OptionT.fromOption(ratePlan.ratePlanCharges.headOption.map(_.id))
      revenueSchedule <- OptionT.liftF(getRevenueSchedule(ratePlanChargeId))
      revenueScheduleNumber <- OptionT.fromOption(revenueSchedule.revenueSchedules.headOption.map(_.number))
      successOrFailureResponse <- OptionT.liftF(distributeRevenueByStartAndEndDates(revenueScheduleNumber, termDates))
    } yield successOrFailureResponse).value
  }

  def getRevenueSchedule(ratePlanChargeId: String): Future[RevenueSchedulesResponse] =
    get[RevenueSchedulesResponse](s"revenue-schedules/subscription-charges/${ratePlanChargeId}", authHeaders)

  def distributeRevenueByStartAndEndDates(
    revenueScheduleNumber: String,
    termDates: TermDates
  ) = {
    val data = DistributeRevenueRequest(termDates.giftStartDate, termDates.giftEndDate)
    putJson[ZuoraSuccessOrFailureResponse](
      s"revenue-schedules/${revenueScheduleNumber}/distribute-revenue-with-date-range",
      data.asJson,
      authHeaders
    )
  }
}
