package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.model.Stage
import com.gu.model.dynamo.SupporterRatePlanItem
import com.gu.model.states.ZuoraResultsFetcherEndState
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.services.{DynamoDBService, S3Service}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import kantan.csv._
import kantan.csv.ops._


class WriteToDatabaseLambda extends Handler[ZuoraResultsFetcherEndState, Unit] {

  override protected def handlerFuture(input: ZuoraResultsFetcherEndState, context: Context) = {
    val csvStream = S3Service.streamFromS3(input.filename)
    val csvReader = csvStream.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val dynamoDBService = DynamoDBService(Stage.fromEnvironment)
    csvReader.foreach {
      case Right(supporterRatePlanItem) => dynamoDBService.writeItem(supporterRatePlanItem)
      case Left(error) => SafeLogger.error(scrub"A read error occurred while trying to read an item from ${input.filename}", error)
    }
    Future.successful(())
  }

}
