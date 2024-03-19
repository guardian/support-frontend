package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.acquisitions.AcquisitionDataRowBuilder
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricSetup.paymentSuccessRequest
import com.gu.config.Configuration
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.catalog.{Contribution => _, DigitalPack => _, Paper => _}
import com.gu.support.workers._
import com.gu.support.workers.exceptions.RetryNone
import com.gu.support.workers.states.SendAcquisitionEventState
import com.gu.support.workers.states.SendThankYouEmailState._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class SendAcquisitionEvent(serviceProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendAcquisitionEventState, Unit](serviceProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
      state: SendAcquisitionEventState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ): FutureHandlerResult = {

    logger.info(s"Sending acquisition event to BigQuery: ${state.toString}")

    state.sendThankYouEmailState match {
      case _: SendThankYouEmailDigitalSubscriptionGiftRedemptionState =>
        // We don't want to send an acquisition event for Digital subscription gift redemptions as we have already done so on purchase
        Future.successful(HandlerResult((), requestInfo))
      case _ =>
        sendAcquisitionEvent(state, requestInfo, services)
    }

  }

  private def sendAcquisitionEvent(state: SendAcquisitionEventState, requestInfo: RequestInfo, services: Services) = {
    sendPaymentSuccessMetric(state).toEither.left
      .foreach(logger.error(scrub"failed to send PaymentSuccess metric", _))

    val acquisition = AcquisitionDataRowBuilder.buildFromState(state, requestInfo)

    services.acquisitionsEventBusService
      .putAcquisitionEvent(acquisition)
      .map {
        case Left(errorMessage) => throw new RetryNone(errorMessage.mkString(" & "))
        case Right(_) => HandlerResult((), requestInfo)
      }
  }

  private def sendPaymentSuccessMetric(state: SendAcquisitionEventState) = {
    // scalastyle:off line.size.limit
    // Used for Cloudwatch alarms: https://github.com/guardian/support-frontend/blob/920e638c35430cc260acdb1878f37bffa1d12fae/support-workers/cloud-formation/src/templates/cfn-template.yaml#L210
    // scalastyle:on line.size.limit
    val cloudwatchEvent =
      paymentSuccessRequest(
        Configuration.stage,
        state.user.isTestUser,
        state.analyticsInfo.paymentProvider,
        state.sendThankYouEmailState.product,
      )
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
  }

}
