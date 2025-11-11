package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.formatDate
import com.gu.support.workers.{
  ClonedDirectDebitPaymentMethod,
  CreditCardReferenceTransaction,
  DirectDebitPaymentMethod,
  PayPalCompletePaymentsReferenceTransaction,
  PayPalReferenceTransaction,
  PaymentMethod,
  SepaPaymentMethod,
}
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianAdLiteState
import org.joda.time.DateTime
import com.gu.zuora.subscriptionBuilders.GuardianAdLiteSubscriptionBuilder

import scala.concurrent.{ExecutionContext, Future}

class GuardianAdLiteEmailFields(created: DateTime) {
  def build(
      state: SendThankYouEmailGuardianAdLiteState,
  )(implicit ec: ExecutionContext): Future[EmailFields] = {
    val subscription_details = SubscriptionEmailFieldHelpers
      .describe(state.paymentSchedule, state.product.billingPeriod, state.product.currency)

    val fields = List(
      "zuorasubscriberid" -> state.subscriptionNumber,
      "email_address" -> state.user.primaryEmailAddress,
      "billing_period" -> state.product.billingPeriod.toString.toLowerCase,
      "first_payment_date" -> formatDate(
        created.plusDays(GuardianAdLiteSubscriptionBuilder.gracePeriodInDays).toLocalDate,
      ),
      "payment_method" -> paymentMethodName(state.paymentMethod),
      "subscription_details" -> subscription_details,
    )

    Future.successful(EmailFields(fields, state.user, "guardian-ad-lite"))
  }

  private def paymentMethodName(method: PaymentMethod): String = method match {
    case _: DirectDebitPaymentMethod => "Direct Debit"
    case _: ClonedDirectDebitPaymentMethod => "Direct Debit"
    case _: SepaPaymentMethod => "SEPA"
    case _: PayPalReferenceTransaction => "PayPal"
    case _: PayPalCompletePaymentsReferenceTransaction => "PayPal"
    case _: CreditCardReferenceTransaction => "credit / debit card"
  }
}
