package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.acquisition.model.OphanIds
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model._
import com.gu.support.workers.model.monthlyContributions.state.SendAcquisitionEventState
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
  ): FutureHandlerResult =
    // Throw any error in the EitherT monad so that in can be processed by ErrorHandler.handleException
    services.ophanService.submit(state).fold(throw _, _ => HandlerResult(Unit, requestInfo))
}

object SendAcquisitionEvent {

  // Typeclass instance used by the Ophan service to attempt to build a submission from the state.
  private implicit val stateAcquisitionSubmissionBuilder: AcquisitionSubmissionBuilder[SendAcquisitionEventState] =

    new AcquisitionSubmissionBuilder[SendAcquisitionEventState] {

      import cats.syntax.either._

      override def buildOphanIds(state: SendAcquisitionEventState): Either[String, OphanIds] =
        Either.fromOption(state.acquisitionData.map(_.ophanIds), "acquisition data not included")

      def paymentFrequencyFromBillingPeriod(billingPeriod: BillingPeriod): thrift.PaymentFrequency =
        // object BillingObject extends the BillingObject trait.
        // Don't match on this as its not a valid billing period.
        (billingPeriod: @unchecked) match {
          case Monthly => thrift.PaymentFrequency.Monthly
          case Annual => thrift.PaymentFrequency.Annually
        }

      def paymentProviderFromPaymentMethod(paymentMethod: PaymentMethod): thrift.PaymentProvider =
        paymentMethod match {
          case _: CreditCardReferenceTransaction => thrift.PaymentProvider.Stripe
          case _: PayPalReferenceTransaction => thrift.PaymentProvider.Paypal
          case _: DirectDebitPaymentMethod => thrift.PaymentProvider.Gocardless
        }

      override def buildAcquisition(state: SendAcquisitionEventState): Either[String, thrift.Acquisition] =
        Either.fromOption(
          state.acquisitionData.map { data =>
            thrift.Acquisition(
              product = ophan.thrift.event.Product.RecurringContribution,
              paymentFrequency = paymentFrequencyFromBillingPeriod(state.contribution.billingPeriod),
              currency = state.contribution.currency.iso,
              amount = state.contribution.amount.toDouble,
              paymentProvider = Some(paymentProviderFromPaymentMethod(state.paymentMethod)),
              // Currently only passing through at most one campaign code
              campaignCode = data.referrerAcquisitionData.campaignCode.map(Set(_)),
              abTests = Some(thrift.AbTestInfo(
                data.supportAbTests ++ Set(data.referrerAcquisitionData.abTest).flatten
              )),
              countryCode = Some(state.user.country.alpha2),
              referrerPageViewId = data.referrerAcquisitionData.referrerPageviewId,
              referrerUrl = data.referrerAcquisitionData.referrerUrl,
              componentId = data.referrerAcquisitionData.componentId,
              componentTypeV2 = data.referrerAcquisitionData.componentType,
              source = data.referrerAcquisitionData.source,
              platform = Some(ophan.thrift.event.Platform.Support),
              queryParameters = data.referrerAcquisitionData.queryParameters
            )
          },
          "acquisition data not included"
        )
    }
}
