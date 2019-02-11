package com.gu.support.workers.lambdas

import java.util.UUID

import com.amazonaws.services.lambda.runtime.Context
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.acquisition.model.{GAData, OphanIds}
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.gu.monitoring.SafeLogger
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers._
import com.gu.support.workers.states.SendAcquisitionEventState
import io.circe.generic.auto._
import ophan.thrift.event.{Product => OphanProduct}
import ophan.thrift.{event => thrift}

import scala.concurrent.ExecutionContext.Implicits.global

class SendAcquisitionEvent(serviceProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendAcquisitionEventState, Unit] {

  import SendAcquisitionEvent._
  import cats.instances.future._

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: SendAcquisitionEventState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    SafeLogger.info(s"Sending acquisition event to ophan: ${state.toString}")
    // Throw any error in the EitherT monad so that in can be processed by ErrorHandler.handleException
    services.acquisitionService.submit(state).fold(errors => throw AnalyticsServiceErrorList(errors), _ => HandlerResult(Unit, requestInfo))
  }
}

object SendAcquisitionEvent {

  case class AnalyticsServiceErrorList(errors: List[AnalyticsServiceError]) extends Throwable {
    override def getMessage: String = errors.map(_.getMessage).mkString(". ")
  }

  // Typeclass instance used by the Ophan service to attempt to build a submission from the state.
  private implicit val stateAcquisitionSubmissionBuilder: AcquisitionSubmissionBuilder[SendAcquisitionEventState] =

    new AcquisitionSubmissionBuilder[SendAcquisitionEventState] {

      import cats.syntax.either._

      override def buildOphanIds(state: SendAcquisitionEventState): Either[String, OphanIds] =
        Either.fromOption(state.acquisitionData.map(_.ophanIds), "acquisition data not included")

      override def buildGAData(a: SendAcquisitionEventState): Either[String, GAData] = {
        for {
          acquisitionData <- Either.fromOption(a.acquisitionData, "acquisition data not included")
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

      def paymentFrequencyFromBillingPeriod(billingPeriod: BillingPeriod): thrift.PaymentFrequency =
        // object BillingObject extends the BillingObject trait.
        // Don't match on this as its not a valid billing period.
        (billingPeriod: @unchecked) match {
          case Monthly => thrift.PaymentFrequency.Monthly
          case Quarterly => thrift.PaymentFrequency.Quarterly
          case Annual => thrift.PaymentFrequency.Annually
        }

      def paymentProviderFromPaymentMethod(paymentMethod: PaymentMethod): thrift.PaymentProvider =
        paymentMethod match {
          case _: CreditCardReferenceTransaction => thrift.PaymentProvider.Stripe
          case _: PayPalReferenceTransaction => thrift.PaymentProvider.Paypal
          case _: DirectDebitPaymentMethod => thrift.PaymentProvider.Gocardless
        }

      override def buildAcquisition(state: SendAcquisitionEventState): Either[String, thrift.Acquisition] = {
        val (productType, productAmount) = state.product match {
          case c: Contribution => (OphanProduct.RecurringContribution, c.amount.toDouble)
          case _: DigitalPack => (OphanProduct.DigitalSubscription, 0D) //TODO: Send the real amount in the acquisition event
        }
        Either.fromOption(
          state.acquisitionData.map { data =>
            thrift.Acquisition(
              product = productType,
              paymentFrequency = paymentFrequencyFromBillingPeriod(state.product.billingPeriod),
              currency = state.product.currency.iso,
              amount = productAmount,
              paymentProvider = Some(paymentProviderFromPaymentMethod(state.paymentMethod)),
              // Currently only passing through at most one campaign code
              campaignCode = data.referrerAcquisitionData.campaignCode.map(Set(_)),
              abTests = Some(thrift.AbTestInfo(
                data.supportAbTests ++ data.referrerAcquisitionData.abTests.getOrElse(Set())
              )),
              countryCode = Some(state.user.country.alpha2),
              referrerPageViewId = data.referrerAcquisitionData.referrerPageviewId,
              referrerUrl = data.referrerAcquisitionData.referrerUrl,
              componentId = data.referrerAcquisitionData.componentId,
              componentTypeV2 = data.referrerAcquisitionData.componentType,
              source = data.referrerAcquisitionData.source,
              platform = Some(ophan.thrift.event.Platform.Support),
              queryParameters = data.referrerAcquisitionData.queryParameters,
              identityId = Some(state.user.id)
            )
          },
          "acquisition data not included"
        )
      }
    }
}
