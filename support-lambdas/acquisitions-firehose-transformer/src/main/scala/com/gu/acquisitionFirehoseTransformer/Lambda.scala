package com.gu.acquisitionFirehoseTransformer

import java.nio.ByteBuffer
import collection.JavaConverters._
import com.typesafe.scalalogging.LazyLogging

import com.amazonaws.services.lambda.runtime.events.KinesisAnalyticsInputPreprocessingResponse._
import com.amazonaws.services.lambda.runtime.events.{KinesisAnalyticsInputPreprocessingResponse, KinesisFirehoseEvent}
import com.amazonaws.services.lambda.runtime.Context

import com.gu.thrift.serializer.ThriftDeserializer
import com.gu.support.acquisitions._

import io.circe.parser.decode
import io.circe.{Decoder}
import io.circe.generic.auto._

import org.joda.time.DateTime

import scala.util.{Try, Success, Failure}

object Json {
  implicit val decodeDateTime: Decoder[DateTime] = Decoder.decodeString.emap { s =>
      Try(DateTime.parse(s)) match {
        case Success(dt) => Right(dt)
        case Failure(e) => Left(e.getMessage)
      }
    }

  implicit val decoder = Decoder[AcquisitionDataRow]
}

object Lambda extends LazyLogging {

  import Json.decoder

  def handler(event: KinesisFirehoseEvent, context: Context): KinesisAnalyticsInputPreprocessingResponse = {
    val records = event.getRecords.asScala

    val results = records.flatMap { record =>
      val inputJson = new String(record.getData.array)

      decode[AcquisitionDataRow](inputJson) match {
        case Left(e) =>
          logger.error(s"Error deserializing record: ${e.getMessage}")
          None
        case Right(acquisition) =>
          AcquisitionToJson(acquisition).map { outputJson =>
            val jsonRow: String = outputJson.noSpaces +"\n"
            new Record(record.getRecordId, Result.Ok, ByteBuffer.wrap(jsonRow.getBytes))
          }
      }
    }

    logger.info(s"Sending ${results.length} csv rows from ${records.length} input records.")

    val response = new KinesisAnalyticsInputPreprocessingResponse()
    response.setRecords(results.asJava)
    response
  }
}
