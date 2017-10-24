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

  def putPaymentMethodCreated(): Future[Unit] = put(s"monthly-contributor-payment-method-created")

  def putZuoraAccountCreated(): Future[Unit] = put(s"monthly-contributor-zuora-account-created")

  def putSalesforceContactCreated(): Future[Unit] = put(s"monthly-contributor-salesforce-contact-created")

  def putThankYouEmailSent(): Future[Unit] = put(s"monthly-contributor-thank-you-email-sent")

  def putContributionCompleted(): Future[Unit] = put(s"monthly-contributor-contribution-completed")

  private def put(metricName: String): Future[Unit] = put(metricName, 1).map(_ => ())

}

class FailureMetrics(
  period: String
) extends CloudWatch(
  productName("RecurringContributor"),
  subscriptionPeriod(period)
) {

  def putFailureHandlerTriggered(): Future[Unit] = put(s"monthly-contributor-failure-handler-triggered")

  private def put(metricName: String): Future[Unit] = put(metricName, 1).map(_ => ())

}
