package com.gu.bigqueryAcquisitionsPublisher

import cats.data.EitherT
import com.amazonaws.services.lambda.runtime.events.SQSBatchResponse.BatchItemFailure
import com.amazonaws.services.lambda.runtime.events.{SQSBatchResponse, SQSEvent}
import com.amazonaws.services.lambda.runtime.events.SQSEvent.SQSMessage
import com.gu.support.acquisitions.BigQueryService
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, Future}
import scala.jdk.CollectionConverters._
import scala.util.{Failure, Success, Try}

object Lambda extends LazyLogging {
  private val stage = sys.env.getOrElse("STAGE", "CODE")

  def handler(event: SQSEvent): SQSBatchResponse = {
    SSMService.getParam(s"/bigquery-acquisitions-publisher/$stage/gcp-wif-credentials-config") match {
      case Right(clientConfig) =>
        val bigQuery = BigQueryService.build(clientConfig)
        val messages = event.getRecords.asScala.toList

        val failedMessageIds = messages
          .map(message => processEvent(message, bigQuery))
          .collect { case Left(messageId) => messageId }

        new SQSBatchResponse(
//          failedMessageIds.map(messageId => new BatchItemFailure(messageId)).asJava,
        )

      case Left(error) =>
        logger.error(s"Error fetching BigQuery config from SSM: $error")
        // Return all messages to the queue
        new SQSBatchResponse(
          event.getRecords.asScala.map(message => new BatchItemFailure(message.getMessageId)).asJava,
        )
    }
  }

  sealed trait Error
  case class ParseError(error: String) extends Error
  case class BigQueryError(errors: List[String]) extends Error

  type SQSMessageId = String

  private def processEvent(message: SQSMessage, bigQuery: BigQueryService): Either[SQSMessageId, Unit] = {
    val rawBody = message.getBody
    val result: EitherT[Future, Error, Unit] = EitherT
      .fromEither[Future](decode[AcquisitionDataRow](rawBody))
      .leftMap[Error](error => ParseError(error.getMessage))
      .flatMap { acq =>
        bigQuery
          .tableInsertRowWithRetry(acq, 0)
          .leftMap[Error](error => BigQueryError(error))
      }
    Try(Await.result(result.value, 20.seconds)) match {
      case Success(Right(_)) =>
        logger.info(s"Successfully processed the event: $rawBody")
        Right(())
      case Success(Left(ParseError(error))) =>
        logger.error(s"Failed to process an event due to ParseError($error)")
        logger.error(s"Failed event was: $rawBody")
        Left(message.getMessageId)
      case Success(Left(BigQueryError(error))) =>
        logger.error(s"Failed to process an event due to BigQueryError($error)")
        logger.error(s"Failed event was: $rawBody")
        Left(message.getMessageId)
      case Failure(error) =>
        logger.error(s"Failed to process an event due to Failure($error)")
        logger.error(s"Failed event was: $rawBody")
        Left(message.getMessageId)
    }
  }
}
