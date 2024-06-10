package com.gu.lambdas

import com.gu.model.ZuoraFieldNames._
import kantan.csv.HeaderCodec
import kantan.csv.java8.{defaultLocalDateCellDecoder, defaultLocalDateCellEncoder}

import java.time.LocalDate

case class SupporterRatePlanItemWithStatus(
    subscriptionName: String, // Unique identifier for the subscription
    identityId: String, // Unique identifier for user
    productRatePlanId: String, // Unique identifier for the product in this rate plan
    productRatePlanName: String, // Name of the product in this rate plan
    termEndDate: LocalDate,
    subscriptionStatus: String,
)

object SupporterRatePlanItemWithStatus {
  implicit val personCodec: HeaderCodec[SupporterRatePlanItemWithStatus] =
    HeaderCodec.caseCodec(
      subscriptionName,
      identityId,
      productRatePlanId,
      productRatePlanName,
      termEndDate,
      "Subscription.Status",
    )(
      SupporterRatePlanItemWithStatus.apply,
    )(
      SupporterRatePlanItemWithStatus.unapply,
    )
}
