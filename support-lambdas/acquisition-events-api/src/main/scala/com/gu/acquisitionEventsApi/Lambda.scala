package com.gu.acquisitionEventsApi

import cats.data.EitherT
import com.amazonaws.services.lambda.runtime.events.{APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent}
import com.gu.support.acquisitions.BigQueryService
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser.decode
import com.gu.support.acquisitions.models.AcquisitionDataRow
import scala.concurrent.duration.DurationInt
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Await, Future}
import scala.util.{Failure, Success, Try}

object Lambda extends LazyLogging {
  def buildResponse(status: Int): APIGatewayProxyResponseEvent = {
    val response = new APIGatewayProxyResponseEvent()
    response.setStatusCode(status)
    response
  }

  def handler(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    val ssmService = new SSMService()
    ssmService.getConfig() match {
      case Right(config) =>
        val bigQuery = new BigQueryService(config)
        processEvent(event, bigQuery)
      case Left(error) =>
        logger.error(s"failed to get big query config from SSM: $error")
        buildResponse(500)
    }
  }

  sealed trait Error
  case class ParseError(error: String) extends Error
  case class BigQueryError(errors: List[String]) extends Error

  def processEvent(event: APIGatewayProxyRequestEvent, bigQuery: BigQueryService): APIGatewayProxyResponseEvent = {
    val rawBody = event.getBody()
    val result = EitherT
      .fromEither[Future](decode[AcquisitionDataRow](rawBody))
      .leftMap[Error](error => ParseError(error.getMessage))
      .flatMap { acq =>
        bigQuery
          .tableInsertRowWithRetry(acq, 5)
          .leftMap[Error](error => BigQueryError(error))
      }
    Try(Await.result(result.value, 20.seconds)) match {
      case Success(Right(_)) =>
        logger.info(s"successfully processed the event: $rawBody")
        buildResponse(200)
      case Success(Left(ParseError(error))) =>
        logger.error(s"failed to process an event: $error")
        buildResponse(400)
      case Success(Left(BigQueryError(error))) =>
        logger.error(s"failed to process an event: $error")
        buildResponse(500)
      case Failure(error) =>
        logger.error(s"failed to process an event: $error")
        buildResponse(500)
    }
  }
}
