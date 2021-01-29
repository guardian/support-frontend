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
    val csvStream = S3Service.streamFromS3(stage, filename)
    val csvReader = csvStream.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val dynamoDBService = DynamoDBService(stage)

    val all = csvReader.zipWithIndex.toList
    val successful = all.filter(_._1.isRight)
    val failed = all.filter(_._1.isLeft)
      if (failed.nonEmpty)
        SafeLogger.error(
          scrub"There were ${failed.length} CSV read failures from file $filename with line numbers ${failed.map(_._2).mkString(",")}"
        )

     successful.map(_._1.right.get)
       .zipWithIndex
       .grouped(50)
       .foreach(list => Await.result(writeGroup(list, dynamoDBService), 30.seconds))
    Future.successful(())
  }

  def writeGroup(list: List[(SupporterRatePlanItem, Int)], dynamoDBService: DynamoDBService) = {
    val futures = list.map{
      case (supporterRatePlanItem, index) =>
        SafeLogger.info(
          s"Attempting to write item index $index - ${supporterRatePlanItem.productRatePlanName} " +
            s"rate plan with term end date ${supporterRatePlanItem.termEndDate} to Dynamo")
        dynamoDBService.writeItem(supporterRatePlanItem)

    }
    Future.sequence(futures)
  }
}
