package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.UpdateDynamoLambda.writeToDynamo
import com.gu.model.Stage
import com.gu.model.dynamo.SupporterRatePlanItem
import com.gu.model.states.UpdateDynamoState
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.services.{DynamoDBService, S3Service}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Await, Future}
import kantan.csv._
import kantan.csv.ops._

import scala.concurrent.duration.DurationInt


class UpdateDynamoLambda extends Handler[UpdateDynamoState, Unit] {
  override protected def handlerFuture(input: UpdateDynamoState, context: Context) = {
    SafeLogger.info(s"Starting write to dynamo task for ${input.recordCount} records from ${input.filename}")
    writeToDynamo(Stage.fromEnvironment, input.filename)
  }
}

object UpdateDynamoLambda {
  def writeToDynamo(stage: Stage, filename: String) = {
    val csvStream = S3Service.streamFromS3(filename)
    val csvReader = csvStream.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val dynamoDBService = DynamoDBService(stage)
    csvReader.foreach {
      case Right(supporterRatePlanItem) =>
        SafeLogger.info(
          s"Attempting to write ${supporterRatePlanItem.productRatePlanName} " +
            s"rate plan with term end date ${supporterRatePlanItem.termEndDate} to Dynamo")
        Await.ready(dynamoDBService.writeItem(supporterRatePlanItem), 20.seconds) //TODO: see if there is a way to parallelise
        SafeLogger.info(
          s"Successfully wrote ${supporterRatePlanItem.productRatePlanName} " +
            s"rate plan with term end date ${supporterRatePlanItem.termEndDate} to Dynamo")
      case Left(error) => SafeLogger.error(scrub"A read error occurred while trying to read an item from $filename", error)
    }
    Future.successful(())
  }
}
