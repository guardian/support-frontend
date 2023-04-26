package com.gu.bigqueryAcquisitionsPublisher

import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode

import scala.jdk.CollectionConverters._

object Lambda extends LazyLogging {
  private val stage = sys.env.getOrElse("STAGE", "CODE")

  def handler(event: SQSEvent): Unit = {
    SSMService.getParam(s"/bigquery-acquisitions-publisher/$stage/gcp-wif-credentials-config") match {
      case Right(clientConfig) =>

      case Left(error) =>
        logger.error(s"Error fetching BigQuery config from SSM: $error")
      // TODO - fail lambda
    }
    val events = event.getRecords.asScala.toList.map(_.getBody).map(decode[AcquisitionDataRow])

    events.foreach(e => logger.info(e.toString))
  }
}
