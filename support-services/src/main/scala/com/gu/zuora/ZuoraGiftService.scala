package com.gu.zuora

import cats.data.OptionT
import cats.implicits.catsStdInstancesForFuture
import com.gu.aws.{AwsCloudWatchMetricPut, AwsCloudWatchMetricSetup}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.{Stage, ZuoraConfig}
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.workers.states.SendThankYouEmailState.TermDates
import com.gu.support.zuora.api.{Day, DistributeRevenueRequest, QueryData, UpdateRedemptionDataRequest}
import com.gu.support.zuora.api.response.{
  RevenueSchedulesResponse,
  Subscription,
  SubscriptionRedemptionQueryResponse,
  ZuoraErrorResponse,
  ZuoraResponse,
  ZuoraSuccessOrFailureResponse,
}
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

  def setupRevenueRecognition(
      subscription: Subscription,
      termDates: TermDates,
  ) = {
    // This doc describes what this method is doing: https://docs.google.com/document/d/1yNeaR2l1Ss_unXygntuntmRX-GicDelryuK25vmqToc/edit
    val response = (for {
      ratePlan <- OptionT.fromOption(subscription.ratePlans.headOption)
      ratePlanChargeId <- OptionT.fromOption(ratePlan.ratePlanCharges.headOption.map(_.id))
      revenueSchedule <- OptionT.liftF(getRevenueSchedule(ratePlanChargeId))
      successOrFailureResponse <- maybeDistributeRevenue(revenueSchedule, termDates)
    } yield successOrFailureResponse).value

    val subscriptionNumber = subscription.subscriptionNumber
    response.transform {
      case Success(Some(response)) if response.success =>
        SafeLogger.info(s"Successfully set up revenue recognition for Digital Subscription gift $subscriptionNumber")
        Success(())
      case failed =>
        val errorMessage =
          scrub"Failed to set up revenue recognition for Digital Subscription gift $subscriptionNumber. Error was $failed"
        SafeLogger.error(errorMessage)
        AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(
          AwsCloudWatchMetricSetup.revenueDistributionFailureRequest(stage),
        )
        // For the revenue recognition we want to continue even if there is a failure because by this point
        // the redemption will have succeeded so we need to let the user know about that and then sort out the
        // revenue recognition separately
        Success(())
    }
  }

  private def getRevenueSchedule(ratePlanChargeId: String): Future[RevenueSchedulesResponse] =
    get[RevenueSchedulesResponse](s"revenue-schedules/subscription-charges/${ratePlanChargeId}", authHeaders)

  private def maybeDistributeRevenue(
      revenueSchedule: RevenueSchedulesResponse,
      termDates: TermDates,
  ) =
    if (revenueScheduleIsAlreadyDistributed(revenueSchedule))
      OptionT.fromOption(Some(ZuoraSuccessOrFailureResponse(success = true, None)))
    else
      for {
        revenueScheduleNumber <- OptionT.fromOption(revenueSchedule.revenueSchedules.headOption.map(_.number))
        successOrFailureResponse <- OptionT.liftF(distributeRevenueByStartAndEndDates(revenueScheduleNumber, termDates))
      } yield successOrFailureResponse

  private def revenueScheduleIsAlreadyDistributed(revenueSchedule: RevenueSchedulesResponse) =
    revenueSchedule.revenueSchedules.exists(revenueSchedule =>
      // revenueSchedule.amount and revenueSchedule.undistributedUnrecognizedRevenue will be
      // the same until the distribute revenue call has been made
      revenueSchedule.amount > revenueSchedule.undistributedUnrecognizedRevenue,
    )

  // https://www.zuora.com/developer/api-reference/#operation/PUT_RevenueByRecognitionStartandEndDates
  private def distributeRevenueByStartAndEndDates(
      revenueScheduleNumber: String,
      termDates: TermDates,
  ) = {
    val data = DistributeRevenueRequest(termDates.giftStartDate, termDates.giftEndDate)
    putJson[ZuoraSuccessOrFailureResponse](
      s"revenue-schedules/${revenueScheduleNumber}/distribute-revenue-with-date-range",
      data.asJson,
      authHeaders,
    )
  }
}
