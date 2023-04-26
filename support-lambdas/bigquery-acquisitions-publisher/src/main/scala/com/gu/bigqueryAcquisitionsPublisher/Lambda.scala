package com.gu.bigqueryAcquisitionsPublisher

import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode

import scala.jdk.CollectionConverters._

object Lambda extends LazyLogging {
  def handler(event: SQSEvent): Unit = {
    val events = event.getRecords.asScala.toList.map(_.getBody).map(decode[AcquisitionDataRow])

    events.foreach(e => logger.info(e.toString))
  }
}
