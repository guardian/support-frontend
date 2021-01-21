package com.gu.model.dynamo

import java.time.LocalDate

case class SupporterRatePlanItem(
  identityId: String, //Unique identifier for user
  productRatePlanId: String, //Unique identifier for this product purchase
  ratePlanId: String, //Unique identifier for this product purchase for this user
  ratePlanName: String,
  termEndDate: LocalDate //Date that this subscription term ends
)

