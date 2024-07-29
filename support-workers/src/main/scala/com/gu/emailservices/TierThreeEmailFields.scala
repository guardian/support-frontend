package com.gu.emailservices

import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailTierThreeState

import scala.concurrent.{ExecutionContext, Future}

class TierThreeEmailFields(
    paperFieldsGenerator: PaperFieldsGenerator,
    touchPointEnvironment: TouchPointEnvironment,
) {
  def build(state: SendThankYouEmailTierThreeState)(implicit ec: ExecutionContext): Future[EmailFields] = {

    /** These fields are added to align with S+ fields as T3 is a combo of S+ and GW */
    val firstPaymentDate =
      SubscriptionEmailFieldHelpers.formatDate(SubscriptionEmailFieldHelpers.firstPayment(state.paymentSchedule).date)

    val promotion = paperFieldsGenerator.getAppliedPromotion(
      state.promoCode,
      state.user.billingAddress.country,
      ProductTypeRatePlans.tierThreeRatePlan(state.product, touchPointEnvironment).map(_.id).getOrElse(""),
    )

    val subscription_details = SubscriptionEmailFieldHelpers
      .describe(state.paymentSchedule, state.product.billingPeriod, state.product.currency, promotion)

    val additionalFields = List(
      ("billing_period", state.product.billingPeriod.toString.toLowerCase),
      ("first payment date", firstPaymentDate),
      ("subscription_details", subscription_details),
    )

    paperFieldsGenerator
      .fieldsFor(
        state.paymentMethod,
        state.paymentSchedule,
        state.promoCode,
        state.accountNumber,
        state.subscriptionNumber,
        state.product,
        state.user,
        ProductTypeRatePlans
          .tierThreeRatePlan(state.product, touchPointEnvironment)
          .map(_.id),
        fixedTerm = false,
        state.firstDeliveryDate,
      )
      .map(fields =>
        EmailFields(
          fields ++ additionalFields,
          state.user,
          "tier-three",
        ),
      )
  }

}
