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
import scala.concurrent.Future

class SendAcquisitionEvent(serviceProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendAcquisitionEventState, Unit] {

  import cats.instances.future._
  import SendAcquisitionEvent._

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: SendAcquisitionEventState, context: Context, services: Services): Future[Unit] =
    // Throw any error in the EitherT monad so that in can be processed by ErrorHandler.handleException
    serviceProvider.forUser(state.user.isTestUser).ophanService.submit(state).fold(throw _, _ => ())
}

object SendAcquisitionEvent {

  // Typeclass instance used by the Ophan service to attempt to build a submission from the state.
  private implicit val stateAcquisitionSubmissionBuilder: AcquisitionSubmissionBuilder[SendAcquisitionEventState] =

    new AcquisitionSubmissionBuilder[SendAcquisitionEventState] {

      override def buildOphanIds(state: SendAcquisitionEventState): Either[String, OphanIds] = Right(state.ophanIds)

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
        }

      override def buildAcquisition(state: SendAcquisitionEventState): Either[String, thrift.Acquisition] =
        Right(
          thrift.Acquisition(
            product = ophan.thrift.event.Product.RecurringContribution,
            paymentFrequency = paymentFrequencyFromBillingPeriod(state.contribution.billingPeriod),
            currency = state.contribution.currency.iso,
            amount = state.contribution.amount.toDouble,
            amountInGBP = None,
            paymentProvider = Some(paymentProviderFromPaymentMethod(state.paymentMethod)),
            // Currently only passing through at most one campaign code
            campaignCode = state.referrerAcquisitionData.campaignCode.map(Set(_)),
            // Currently only passing through at most one AB test
            abTests = state.referrerAcquisitionData.abTest.map(test => thrift.AbTestInfo(Set(test))),
            // FIXME: currently not passing through country code
            countryCode = None,
            referrerPageViewId = state.referrerAcquisitionData.referrerPageviewId,
            referrerUrl = state.referrerAcquisitionData.referrerUrl,
            componentId = state.referrerAcquisitionData.componentId,
            componentTypeV2 = state.referrerAcquisitionData.componentType,
            source = state.referrerAcquisitionData.source
          )
        )
    }
}
