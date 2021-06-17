package com.gu.acquisitionFirehoseTransformer

import java.nio.ByteBuffer
import collection.JavaConverters._
import com.typesafe.scalalogging.LazyLogging

import com.amazonaws.services.lambda.runtime.events.KinesisAnalyticsInputPreprocessingResponse._
import com.amazonaws.services.lambda.runtime.events.{KinesisAnalyticsInputPreprocessingResponse, KinesisFirehoseEvent}
import com.amazonaws.services.lambda.runtime.Context

import com.gu.thrift.serializer.ThriftDeserializer
import ophan.thrift.event.Acquisition

object Lambda extends LazyLogging {

  def handler(event: KinesisFirehoseEvent, context: Context): KinesisAnalyticsInputPreprocessingResponse = {
    val records = event.getRecords.asScala

    val results = records.flatMap { record =>
      ThriftDeserializer.deserialize(record.getData.array)(Acquisition).fold(
        (e: Throwable) => {
          logger.error(s"Error deserializing record: ${e.getMessage}")
          None
        },
        (acquisition: Acquisition) => {
          val jsonRow: String = AcquisitionToJson(acquisition, record.getApproximateArrivalTimestamp).noSpaces +"\n"

          Some {
            new Record(record.getRecordId, Result.Ok, ByteBuffer.wrap(jsonRow.getBytes))
          }
        }
      )
    }

    logger.info(s"Sending ${results.length} csv rows from ${records.length} input records.")

    val response = new KinesisAnalyticsInputPreprocessingResponse()
    response.setRecords(results.asJava)
    response
  }
}
