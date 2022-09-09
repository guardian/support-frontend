package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.lambdas.SupporterRatePlanItemCodec.codec
import com.gu.model.StageConstructors
import com.gu.model.sqs.SqsEvent
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger.Sanitizer
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{AlarmService, ConfigService, ZuoraSubscriptionService}
import com.gu.supporterdata.model.Stage.{DEV, PROD, UAT}
import com.gu.supporterdata.model.{ContributionAmount, Stage, SupporterRatePlanItem}
import com.gu.supporterdata.services.SupporterDataDynamoService
import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
import io.circe.parser._
import io.circe.syntax.EncoderOps

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration.DurationInt
import scala.util.{Failure, Success}

class ProcessSupporterRatePlanItemLambda extends Handler[SqsEvent, Unit] {

  override protected def handlerFuture(input: SqsEvent, context: Context) = {
    SafeLogger.info(s"Received ${input.Records.length} records from the queue")
    Future
      .sequence(input.Records.map { record =>
        val subscription = decode[SupporterRatePlanItem](record.body)
        subscription match {
          case Right(item) => ProcessSupporterRatePlanItemLambda.processItem(item)
          case _ =>
            SafeLogger.warn(s"Couldn't decode a SupporterRatePlanItem with body: ${record.body}")
            Future.successful(()) // This should never happen so I don't think it's worth alerting on
        }
      })
      .map(_ => ())
  }
}

object ProcessSupporterRatePlanItemLambda {
  val stage = StageConstructors.fromEnvironment
  val config = ConfigService(stage).load
  val dynamoService = SupporterDataDynamoService(stage)
  val contributionIds = ContributionIds.forStage(stage)
  lazy val contributionAmountFetcher = new ContributionAmountFetcher(config)
  lazy val alarmService = AlarmService(stage)

  def isRecurringContribution(supporterRatePlanItem: SupporterRatePlanItem) =
    contributionIds.contains(supporterRatePlanItem.productRatePlanId)

  def addAmountIfContribution(supporterRatePlanItem: SupporterRatePlanItem) =
    if (isRecurringContribution(supporterRatePlanItem)) {
      SafeLogger.info(s"Supporter ${supporterRatePlanItem.identityId} is a recurring contributor")
      contributionAmountFetcher.fetchContributionAmountFromZuora(supporterRatePlanItem)
    } else
      Future.successful(supporterRatePlanItem)

  def processItem(supporterRatePlanItem: SupporterRatePlanItem) =
    addAmountIfContribution(supporterRatePlanItem)
      .flatMap(writeItemToDynamo)

  def writeItemToDynamo(supporterRatePlanItem: SupporterRatePlanItem) = {
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

class ContributionAmountFetcher(config: ZuoraQuerierConfig) {
  lazy val zuoraService = new ZuoraSubscriptionService(config, configurableFutureRunner(60.seconds))

  def fetchContributionAmountFromZuora(supporterRatePlanItem: SupporterRatePlanItem) =
    zuoraService
      .getSubscription(supporterRatePlanItem.subscriptionName)
      .map { sub =>
        SafeLogger.info(
          s"Contribution amount for supporter ${supporterRatePlanItem.identityId} is ${sub.contributionAmount}",
        )
        supporterRatePlanItem.copy(contributionAmount = sub.contributionAmount)
      }

}

object SupporterRatePlanItemCodec {
  implicit val codec: Codec[SupporterRatePlanItem] = deriveCodec
  implicit val contributionCodec: Codec[ContributionAmount] = deriveCodec
}

object ContributionIds {
  def forStage(stage: Stage) = stage match {
    case PROD => List("2c92a0fc5aacfadd015ad24db4ff5e97", "2c92a0fc5e1dc084015e37f58c200eea")
    case UAT => List("2c92c0f85ab269be015acd9d014549b7", "2c92c0f95e1d5c9c015e38f8c87d19a1")
    case DEV => List("2c92c0f85a6b134e015a7fcd9f0c7855", "2c92c0f85e2d19af015e3896e824092c")
  }
}
