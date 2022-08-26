package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.SupporterRatePlanItemCodec.codec
import com.gu.model.StageConstructors
import com.gu.model.sqs.SqsEvent
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.services.AlarmService
import com.gu.supporterdata.model.SupporterRatePlanItem
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.typesafe.scalalogging.StrictLogging
import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
import io.circe.parser._
import io.circe.syntax.EncoderOps

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

class ProcessSubscriptionLambda extends Handler[SqsEvent, Unit] {
  override protected def handlerFuture(input: SqsEvent, context: Context) = {
    val stage = StageConstructors.fromEnvironment
    val dynamoService = SupporterDataDynamoService(stage)
    val alarmService = AlarmService(stage)
    val subscriptionProcessor = new SubscriptionProcessor(dynamoService, alarmService)
    Future
      .sequence(input.Records.map { record =>
        val subscription = decode[SupporterRatePlanItem](record.body)
        subscription match {
          case Right(item) => subscriptionProcessor.processSubscription(item)
          case _ =>
            SafeLogger.warn(s"Couldn't decode a SupporterRatePlanItem with body: ${record.body}")
            Future.successful(()) // This should never happen so I don't think it's worth alerting on
        }

      })
      .map(_ => ())
  }
}

class SubscriptionProcessor(dynamoService: SupporterDataDynamoService, alarmService: AlarmService)
    extends StrictLogging {
  def processSubscription(supporterRatePlanItem: SupporterRatePlanItem) = {
    SafeLogger.info(s"Attempting to write item to Dynamo - ${supporterRatePlanItem.asJson.noSpaces}")
    try {
      dynamoService.writeItem(supporterRatePlanItem).map { _ =>
        SafeLogger.info(s"Successfully wrote item to Dynamo - ${supporterRatePlanItem.asJson.noSpaces}")
        ()
      }
    } catch {
      case t: Throwable =>
        SafeLogger.error(scrub"Error writing item to Dynamo - ${supporterRatePlanItem.asJson.noSpaces}", t)
        alarmService.triggerDynamoWriteAlarm match {
          case Success(_) => Future.successful(())
          case Failure(exception) =>
            SafeLogger.error(scrub"Failed to trigger dynamo alarm", exception)
            Future.successful(())
        }
    }
  }

}

object SupporterRatePlanItemCodec {
  implicit val codec: Codec[SupporterRatePlanItem] = deriveCodec
}
