package com.gu.acquisitionFirehoseTransformer

import java.nio.ByteBuffer
import scala.jdk.CollectionConverters._
import com.typesafe.scalalogging.LazyLogging
import com.amazonaws.services.lambda.runtime.events.KinesisAnalyticsInputPreprocessingResponse._
import com.amazonaws.services.lambda.runtime.events.{KinesisAnalyticsInputPreprocessingResponse, KinesisFirehoseEvent}
import com.gu.support.acquisitions.models.AcquisitionDataRow
import cats.syntax.all._
import io.circe.parser.decode

import scala.concurrent.ExecutionContext.Implicits.global
import com.gu.i18n.Currency
import org.joda.time.DateTime
import com.gu.support.acquisitions.calculator.AcquisitionModel
import com.gu.support.acquisitions.calculator.AnnualisedValueTwoCalculator

case class AcquisitionWithRecordId(val acquisition: AcquisitionDataRow, recordId: String)

object Lambda extends LazyLogging {

  def handler(event: KinesisFirehoseEvent): KinesisAnalyticsInputPreprocessingResponse = {
    processEvent(event, GBPConversionServiceImpl)
  }

  def processEvent(
      event: KinesisFirehoseEvent,
      gbpService: GBPConversionService,
  ): KinesisAnalyticsInputPreprocessingResponse = {
    val records = event.getRecords.asScala

    def decodeAcquisitions(): Either[String, List[AcquisitionWithRecordId]] = records.toList.map { record =>
      val inputJson = new String(record.getData.array)
      decode[AcquisitionDataRow](inputJson)
        .map { acq =>
          AcquisitionWithRecordId(acq, record.getRecordId)
        }
        .leftMap(_.getMessage)
    }.sequence

    def getAcquisitionsWithAmounts(
        acquisitions: List[AcquisitionWithRecordId],
    ): List[(BigDecimal, AcquisitionWithRecordId)] =
      acquisitions.flatMap { acquisitionWithRecordId =>
        acquisitionWithRecordId.acquisition.amount.map { amount =>
          (amount, acquisitionWithRecordId)
        }
      }

    def getAnnualisedValue(amount: BigDecimal, acquisition: AcquisitionDataRow): Either[String, Double] = {
      val acqModel = AcquisitionModel(
        amount = amount.toDouble,
        product = acquisition.product,
        currency = acquisition.currency.iso,
        paymentFrequency = acquisition.paymentFrequency,
        paymentProvider = acquisition.paymentProvider,
        printOptions = None,
      )

      AnnualisedValueTwoCalculator.getAnnualisedValue(acqModel)
    }

    def buildRecords(acquisitions: List[(BigDecimal, AcquisitionWithRecordId)]): Either[String, List[Record]] =
      acquisitions.map { case (amount, AcquisitionWithRecordId(acquisition, recordId)) =>
        val conversionDate = DateTime.now().minusDays(1)
        for {
          av <- getAnnualisedValue(amount, acquisition)
          avGBP <-
            if (acquisition.currency == Currency.GBP) Right(av)
            else gbpService.convert(acquisition.currency, av, conversionDate)
        } yield {
          val outputJson = AcquisitionToJson(amount, av, avGBP, acquisition).noSpaces + "\n"
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
}
