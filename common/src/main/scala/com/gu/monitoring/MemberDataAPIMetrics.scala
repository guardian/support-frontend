package com.gu.monitoring

import ProductDimensions._
class MembersDataAPIMetrics(val name: String) extends CloudWatch(Seq(
  productName(name)
)) {

  def putMembersDataAPIUpdated(): Unit = put(s"$name-members-data-api-updated")

  private def put(metricName: String): Unit = put(metricName, 1)

}

