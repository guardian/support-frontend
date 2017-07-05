package com.gu.monitoring

import ProductDimensions._

import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.Future
class MembersDataAPIMetrics(name: String) extends CloudWatch(productName(name)) {

  def putMembersDataAPIUpdated(): Future[Unit] = put(s"$name-members-data-api-updated")

  private def put(metricName: String): Future[Unit] = put(metricName, 1).map(_ => ())

}

