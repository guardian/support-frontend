package com.gu.monitoring

import com.amazonaws.services.cloudwatch.model.Dimension

object ProductDimensions {
  def productName(name: String): Dimension = new Dimension().withName("ProductName").withValue(name)
  def paymentMethod(method: String): Dimension = new Dimension().withName("PaymentMethod").withValue(method)
  def subscriptionPeriod(period: String): Dimension = new Dimension().withName("SubscriptionPeriod").withValue(period)
}
