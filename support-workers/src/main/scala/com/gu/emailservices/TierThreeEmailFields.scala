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
    // TODO: don't really know what we need here yet
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
          fields,
          state.user,
          "tier-three",
        ),
      )
  }

}
