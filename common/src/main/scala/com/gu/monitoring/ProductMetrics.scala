package com.gu.monitoring

import com.amazonaws.services.cloudwatch.model.Dimension

trait ProductMetrics extends CloudWatch {

  //Product's Dimensions
  val productName: String
  val paymentMethod: String
  val subscriptionPeriod: String

  val productDimensions: Seq[Dimension] = Seq(
    new Dimension()
      .withName("ProductName").withValue(productName)
      .withName("PaymentMethod").withValue(paymentMethod)
      .withName("SubscriptionPeriod").withValue(subscriptionPeriod)
  )

  override val allDimensions: Seq[Dimension] = commonDimensions ++ productDimensions
}