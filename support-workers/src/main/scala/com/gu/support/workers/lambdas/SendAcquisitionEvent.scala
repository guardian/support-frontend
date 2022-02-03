package com.gu.support.workers.lambdas

import cats.data.EitherT
import com.amazonaws.services.lambda.runtime.Context
import com.gu.acquisitions.AcquisitionDataRowBuilder
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricSetup.paymentSuccessRequest
import com.gu.config.Configuration
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.acquisitions.ga.models.GAData
import com.gu.support.catalog.{Contribution => _, DigitalPack => _, Paper => _}
import com.gu.support.promotions.PromoCode
import com.gu.support.workers._
import com.gu.support.workers.exceptions.RetryNone
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}

import java.util.UUID
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

    state.sendThankYouEmailState match {
      case _: SendThankYouEmailDigitalSubscriptionGiftRedemptionState =>
        // We don't want to send an acquisition event for Digital subscription gift redemptions as we have already done so on purchase
        Future.successful(HandlerResult((), requestInfo))
      case _ =>
        sendAcquisitionEvent(state, requestInfo, services)
    }

  }

  private def buildGaData(state: SendAcquisitionEventState, requestInfo: RequestInfo): Either[String, GAData] = {
    import cats.syntax.either._
    for {
      acquisitionData <- Either.fromOption(state.acquisitionData, "acquisition data not included")
      ref = acquisitionData.referrerAcquisitionData
      hostname <- Either.fromOption(ref.hostname, "missing hostname in referrer acquisition data")
      gaClientId = ref.gaClientId.getOrElse(UUID.randomUUID().toString)
      ipAddress = ref.ipAddress
      userAgent = ref.userAgent
    } yield GAData(
      hostname = hostname,
      clientId = gaClientId,
      clientIpAddress = ipAddress,
      clientUserAgent = userAgent
    )
  }

  private def sendAcquisitionEvent(state: SendAcquisitionEventState, requestInfo: RequestInfo, services: Services) = {
    sendPaymentSuccessMetric(state).toEither.left.foreach(SafeLogger.error(scrub"failed to send PaymentSuccess metric", _))

    val acquisition = AcquisitionDataRowBuilder.buildFromState(state, requestInfo)

    val streamFuture = services.acquisitionsStreamService.putAcquisitionWithRetry(acquisition, maxRetries = 5)
    val biqQueryFuture = services.bigQueryService.tableInsertRowWithRetry(acquisition, maxRetries = 5)
    val gaFuture = for {
      gaData <- EitherT.fromEither(buildGaData(state, requestInfo)).leftMap(err => List(err))
      result <- services.gaService.submit(acquisition, gaData, maxRetries = 5).leftMap(gaErrors => gaErrors.map(_.getMessage))
    } yield result

    val result = for {
      _ <- streamFuture
      _ <- biqQueryFuture
      _ <- gaFuture
    } yield ()

    result.value.map {
      case Left(errorMessage) => throw new RetryNone(errorMessage.mkString(" & "))
      case Right(_) => HandlerResult((), requestInfo)
    }
  }

  private def sendPaymentSuccessMetric(state: SendAcquisitionEventState) = {
    // scalastyle:off line.size.limit
    // Used for Cloudwatch alarms: https://github.com/guardian/support-frontend/blob/920e638c35430cc260acdb1878f37bffa1d12fae/support-workers/cloud-formation/src/templates/cfn-template.yaml#L210
    // scalastyle:on line.size.limit
    val cloudwatchEvent = paymentSuccessRequest(Configuration.stage, state.user.isTestUser, state.analyticsInfo.paymentProvider, state.sendThankYouEmailState.product)
    AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(cloudwatchEvent)
  }

  private def maybePromoCode(s: SendThankYouEmailState): Option[PromoCode] = s match {
    case _: SendThankYouEmailContributionState => None
    case s: SendThankYouEmailDigitalSubscriptionDirectPurchaseState => s.promoCode
    case s: SendThankYouEmailDigitalSubscriptionGiftPurchaseState => s.promoCode
    case _: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState => None
    case _: SendThankYouEmailDigitalSubscriptionGiftRedemptionState => None
    case s: SendThankYouEmailPaperState => s.promoCode
    case s: SendThankYouEmailGuardianWeeklyState => s.promoCode
  }

}

