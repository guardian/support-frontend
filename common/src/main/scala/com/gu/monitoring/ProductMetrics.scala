package com.gu.monitoring

import com.amazonaws.services.cloudwatch.model.Dimension

trait ProductMetrics extends CloudWatch {

  //Product's Dimensions
  def productName: String
  val paymentMethod: String
  val subscriptionPeriod: String

  val productDimensions: Seq[Dimension] = Seq(
    new Dimension().withName("ProductName").withValue(productName),
    new Dimension().withName("PaymentMethod").withValue(paymentMethod),
    new Dimension().withName("SubscriptionPeriod").withValue(subscriptionPeriod)
  )

  override val allDimensions: Seq[Dimension] = commonDimensions ++ productDimensions
}