package com.gu.monitoring.products

import com.gu.monitoring._
import ProductDimensions._

import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global

class RecurringContributionsMetrics(
  method: String,
  period: String
) extends CloudWatch(
  productName("RecurringContributor"),
  paymentMethod(method),
  subscriptionPeriod(period)
) {

  def putContributionSignUpStartProcess(): Future[Unit] = put(s"monthly-contributor-sign-up-start")

  def putZuoraAccountCreated(): Future[Unit] = put(s"monthly-contributor-zuora-account-created")

  private def put(metricName: String): Future[Unit] = put(metricName, 1).map(_ => ())

}