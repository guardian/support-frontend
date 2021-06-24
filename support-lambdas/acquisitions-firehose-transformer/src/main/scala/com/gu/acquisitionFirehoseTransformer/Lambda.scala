package com.gu.acquisitionFirehoseTransformer

import java.nio.ByteBuffer
import collection.JavaConverters._
import com.typesafe.scalalogging.LazyLogging

import com.amazonaws.services.lambda.runtime.events.KinesisAnalyticsInputPreprocessingResponse._
import com.amazonaws.services.lambda.runtime.events.{KinesisAnalyticsInputPreprocessingResponse, KinesisFirehoseEvent}
import com.amazonaws.services.lambda.runtime.Context

import com.gu.support.acquisitions._
import com.gu.acquisitionsValueCalculatorClient.service.AnnualisedValueService

import cats.implicits._
import cats.instances.either._
import io.circe.parser.decode
import io.circe.Decoder
import io.circe.generic.auto._

import org.joda.time.DateTime

import scala.util.{Try, Success, Failure}
import scala.concurrent.ExecutionContext.Implicits.global
import com.gu.acquisitionsValueCalculatorClient.model.AcquisitionModel
import com.gu.acquisition.instances.paymentFrequency
import com.gu.acquisition.instances.paymentProvider
import scala.concurrent.ExecutionContext
import com.gu.acquisition.instances.acquisition


case class AcquisitionWithRecordId(val acquisition: AcquisitionDataRow, recordId: String)

object Lambda extends LazyLogging {

  def handler(event: KinesisFirehoseEvent, context: Context): KinesisAnalyticsInputPreprocessingResponse = {
    val records = event.getRecords.asScala

    def decodeAcquisitions(): Either[String, List[AcquisitionWithRecordId]] = records.toList.map { record =>
      val inputJson = new String(record.getData.array)
      decode[AcquisitionDataRow](inputJson)
        .map { acq =>
          AcquisitionWithRecordId(acq, record.getRecordId)
        }
        .leftMap(_.getMessage)
    }.sequence

    def getAcquisitionsWithAmounts(acquisitions: List[AcquisitionWithRecordId]): List[(BigDecimal, AcquisitionWithRecordId)] =
      acquisitions.flatMap { acquisitionWithRecordId =>
          acquisitionWithRecordId.acquisition.amount.map { amount =>
            (amount, acquisitionWithRecordId)
          }
      }

    def buildRecords(acquisitions: List[(BigDecimal, AcquisitionWithRecordId)]): Either[String, List[Record]] =
      acquisitions.map {
        case (amount, AcquisitionWithRecordId(acquisition, recordId)) =>
          getAnnualisedValue(amount, acquisition).map { av =>
            val outputJson = AcquisitionToJson(amount, av, acquisition).noSpaces +"\n"
            new Record(recordId, Result.Ok, ByteBuffer.wrap(outputJson.getBytes))
          }
      }.sequence

    val maybeRecords = for {
      acquisitions <- decodeAcquisitions()
      acquisitionsWithAmounts = getAcquisitionsWithAmounts(acquisitions)
      outputRecords <- buildRecords(acquisitionsWithAmounts)
    } yield outputRecords

    maybeRecords match {
      case Left(err) => throw new Exception(err)
      case Right(results) =>
        logger.info(s"Sending ${results.length} csv rows from ${records.length} input records.")

        val response = new KinesisAnalyticsInputPreprocessingResponse()
        response.setRecords(results.asJava)
        response
    }
  }


  def getAnnualisedValue(amount: BigDecimal, acquisition: AcquisitionDataRow): Either[String, Double] = {
    val acqModel = AcquisitionModel(
      amount = amount.toDouble,
      product = acquisition.product.value,
      currency = acquisition.currency.iso,
      paymentFrequency = acquisition.paymentFrequency.value,
      paymentProvider = acquisition.paymentProvider.map(_.value),
      printOptions = None)

    AnnualisedValueService.getAV(acqModel, "ophan")
  }
}
