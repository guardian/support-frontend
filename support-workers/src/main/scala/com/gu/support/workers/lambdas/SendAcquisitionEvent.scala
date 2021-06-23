package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.bigquery.BigQueryOptions
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.acquisition.model.{GAData, OphanIds}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.gu.acquisitions.AcquisitionDataRowBuilder
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricSetup.paymentSuccessRequest
import com.gu.config.Configuration
import com.gu.monitoring.{LambdaExecutionResult, SafeLogger, Success}
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.acquisitions.AcquisitionEventTable
import com.gu.support.catalog.{Contribution => _, DigitalPack => _, Paper => _, _}
import com.gu.support.workers._
import com.gu.support.workers.exceptions.RetryNone
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class SendAcquisitionEvent(serviceProvider: ServiceProvider = ServiceProvider)
  extends ServicesHandler[SendAcquisitionEventState, Unit](serviceProvider) {

  import cats.instances.future._

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: SendAcquisitionEventState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {

    SafeLogger.info(s"Sending acquisition event to BigQuery: ${state.toString}")

    logToElasticSearch(state)

    state.sendThankYouEmailState match {
      case _: SendThankYouEmailDigitalSubscriptionGiftRedemptionState =>
        // We don't want to send an acquisition event for Digital subscription gift redemptions as we have already done so on purchase
        Future.successful(HandlerResult((), requestInfo))
      case _ =>
        sendAcquisitionEvent(state, requestInfo, services)
    }

  }

  private def sendAcquisitionEvent(state: SendAcquisitionEventState, requestInfo: RequestInfo, services: Services) = {
    sendPaymentSuccessMetric(state)

    val acquisition = AcquisitionDataRowBuilder.buildFromState(state, requestInfo)

    val streamFuture = services.acquisitionsStreamService.putAcquisitionWithRetry(acquisition, maxRetries = 5)
    val biqQueryFuture = services.bigQueryService.tableInsertRowWithRetry(acquisition, maxRetries = 5)

    val result = for {
      streamResult <- streamFuture
      bigQueryResult <- biqQueryFuture
    } yield ()

    result.value.map {
      case Left(errorMessage) => throw new RetryNone(errorMessage)
      case Right(_) => HandlerResult((), requestInfo)
    }
  }

  private def sendPaymentSuccessMetric(state: SendAcquisitionEventState) = {
    // scalastyle:off line.size.limit
    // Used for Cloudwatch alarms: https://github.com/guardian/support-frontend/blob/920e638c35430cc260acdb1878f37bffa1d12fae/support-workers/cloud-formation/src/templates/cfn-template.yaml#L210
    // scalastyle:on line.size.limit
    val cloudwatchEvent = paymentSuccessRequest(Configuration.stage, state.analyticsInfo.paymentProvider, state.sendThankYouEmailState.product)
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
  }

  private def logToElasticSearch(state: SendAcquisitionEventState) =
    LambdaExecutionResult.logResult(
      LambdaExecutionResult(
        state.requestId,
        Success,
        state.user.isTestUser,
        state.sendThankYouEmailState.product,
        state.analyticsInfo.paymentProvider,
        state.sendThankYouEmailState match {
          case p: SendThankYouEmailPaperState => Some(p.firstDeliveryDate)
          case p: SendThankYouEmailGuardianWeeklyState => Some(p.firstDeliveryDate)
          case _ => None
        },
        state.analyticsInfo.isGiftPurchase,
        SendOldAcquisitionEvent.maybePromoCode(state.sendThankYouEmailState),
        state.user.billingAddress.country,
        state.user.deliveryAddress.map(_.country),
        None,
        None
      )
    )
}

