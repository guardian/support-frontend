package com.gu.monitoring.products

import com.gu.monitoring._
import ProductDimensions._
class RecurringContributionsMetrics(
  val method: String,
  val period: String
) extends CloudWatch(Seq(
  productName("RecurringContributor"),
  paymentMethod(method),
  subscriptionPeriod(period)
)) {

  def putContributionSignUpStartProcess(): Unit = put(s"monthly-contributor-sign-up-start")

  def putZuoraAccountCreated(): Unit = put(s"monthly-contributor-zuora-account-created")

  private def put(metricName: String): Unit = put(metricName, 1)

}

