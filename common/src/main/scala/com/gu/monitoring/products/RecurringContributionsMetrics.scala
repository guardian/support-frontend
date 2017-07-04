package com.gu.monitoring.products

import com.gu.config.Configuration
import com.gu.monitoring.ProductMetrics

class RecurringContributionsMetrics(
  override val paymentMethod: String,
  override val subscriptionPeriod: String
) extends ProductMetrics {

  override val productName: String = "RecurringContributor"
  override val stage: String = Configuration.stage

  def putContributionSignUpStartProcess(): Unit = put(s"monthly-contributor-sign-up-start")

  def putContributionSignUpSuccess(): Unit = put(s"monthly-contributor-sign-up-success")

  private def put(metricName: String): Unit = {
    put(metricName, 1)
  }

}