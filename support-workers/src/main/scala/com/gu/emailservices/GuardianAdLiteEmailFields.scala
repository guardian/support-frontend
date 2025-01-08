package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.formatDate
import com.gu.support.workers.{
  ClonedDirectDebitPaymentMethod,
  CreditCardReferenceTransaction,
  DirectDebitPaymentMethod,
  PayPalReferenceTransaction,
  PaymentMethod,
  SepaPaymentMethod,
}
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianAdLightState
import org.joda.time.DateTime
import com.gu.zuora.subscriptionBuilders.GuardianAdLightSubscriptionBuilder

import scala.concurrent.{ExecutionContext, Future}

class GuardianAdLightEmailFields(created: DateTime) {
  def build(
      state: SendThankYouEmailGuardianAdLightState,
  )(implicit ec: ExecutionContext): Future[EmailFields] = {
    val subscription_details = SubscriptionEmailFieldHelpers
      .describe(state.paymentSchedule, state.product.billingPeriod, state.product.currency)

    val fields = List(
      "zuorasubscriberid" -> state.subscriptionNumber,
      "email_address" -> state.user.primaryEmailAddress,
      "billing_period" -> state.product.billingPeriod.toString.toLowerCase,
      "first_payment_date" -> formatDate(
        created.plusDays(GuardianAdLightSubscriptionBuilder.gracePeriodInDays).toLocalDate,
      ),
      "payment_method" -> paymentMethodName(state.paymentMethod),
      "subscription_details" -> subscription_details,
    )

    Future.successful(EmailFields(fields, state.user, "guardian-light"))
  }

  private def paymentMethodName(method: PaymentMethod): String = method match {
    case _: DirectDebitPaymentMethod => "Direct Debit"
    case _: ClonedDirectDebitPaymentMethod => "Direct Debit"
    case _: SepaPaymentMethod => "SEPA"
    case _: PayPalReferenceTransaction => "PayPal"
    case _: CreditCardReferenceTransaction => "credit / debit card"
  }
}
