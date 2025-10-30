package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.lambdas.ProcessSupporterRatePlanItemLambda.{contributionIds, discountIds}
import com.gu.model.StageConstructors
import com.gu.model.dynamo.SupporterRatePlanItemCodecs._
import com.gu.model.sqs.SqsEvent
import com.gu.model.zuora.response.MinimalZuoraSubscription
import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{AlarmService, ConfigService, DiscountService, ZuoraSubscriptionService}
import com.gu.supporterdata.model.Stage.{CODE, PROD}
import com.gu.supporterdata.model.{ContributionAmount, Stage, SupporterRatePlanItem}
import com.gu.supporterdata.services.SupporterDataDynamoService
import io.circe.parser._
import io.circe.syntax.EncoderOps

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration.DurationInt
import scala.util.{Failure, Success}

class ProcessSupporterRatePlanItemLambda extends Handler[SqsEvent, Unit] {

  override protected def handlerFuture(input: SqsEvent, context: Context) = {
    logger.info(s"Received ${input.Records.length} records from the queue")
    Future
      .sequence(input.Records.map { record =>
        val subscription = decode[SupporterRatePlanItem](record.body)
        subscription match {
          case Right(item) => ProcessSupporterRatePlanItemLambda.processItem(item)
          case _ =>
            Future.failed(new Exception(s"Couldn't decode a SupporterRatePlanItem with body: ${record.body}"))
        }
      })
      .map(_ => ())
  }
}

object ProcessSupporterRatePlanItemLambda extends SafeLogging {
  val stage = StageConstructors.fromEnvironment
  val config = ConfigService(stage).load
  val dynamoService = SupporterDataDynamoService(stage)
  val contributionIds = ContributionIds.forStage(stage)
  val discountIds = DiscountService(stage).getDiscountProductRatePlanIds.get
  lazy val contributionAmountFetcher = new ContributionAmountFetcher(config)
  lazy val alarmService = AlarmService(stage)

  private def isRecurringContribution(supporterRatePlanItem: SupporterRatePlanItem) =
    contributionIds.contains(supporterRatePlanItem.productRatePlanId)

  private def addAmountIfContribution(supporterRatePlanItem: SupporterRatePlanItem) =
    if (isRecurringContribution(supporterRatePlanItem)) {
      logger.info(
        s"Subscription ${supporterRatePlanItem.subscriptionName} of supporter ${supporterRatePlanItem.identityId} is a recurring contribution",
      )
      contributionAmountFetcher.fetchContributionAmountFromZuora(supporterRatePlanItem)
    } else
      Future.successful(supporterRatePlanItem)

  private def itemIsDiscount(supporterRatePlanItem: SupporterRatePlanItem) =
    discountIds.contains(supporterRatePlanItem.productRatePlanId)

  def processItem(supporterRatePlanItem: SupporterRatePlanItem) = {
    if (itemIsDiscount(supporterRatePlanItem)) {
      logger.info(s"Supporter rate plan item ${supporterRatePlanItem.asJson.spaces2} is a discount")
      Future.successful(())
    } else
      addAmountIfContribution(supporterRatePlanItem).flatMap(writeItemToDynamo)
  }

  private def writeItemToDynamo(supporterRatePlanItem: SupporterRatePlanItem) = {
    logger.info(s"Attempting to write item to Dynamo - ${supporterRatePlanItem.asJson.noSpaces}")

    dynamoService
      .writeItem(supporterRatePlanItem)
      .map { _ =>
        logger.info(s"Successfully wrote item to Dynamo - ${supporterRatePlanItem.asJson.noSpaces}")
        ()
      }
      .recover { case t: Throwable =>
        logger.error(scrub"Error writing item to Dynamo - ${supporterRatePlanItem.asJson.noSpaces}", t)
        alarmService.triggerDynamoWriteAlarm match {
          case Success(_) => Future.successful(())
          case Failure(exception) =>
            logger.error(scrub"Failed to trigger dynamo alarm", exception)
            Future.successful(())
        }
      }
  }
}

class ContributionAmountFetcher(config: ZuoraQuerierConfig) extends SafeLogging {
  lazy val zuoraService = new ZuoraSubscriptionService(config, configurableFutureRunner(60.seconds))

  private def contributionAmountFromZuoraSubscription(subscription: MinimalZuoraSubscription) =
    for {
      contributionRatePlan <- subscription.ratePlans.find(ratePlan => contributionIds.contains(ratePlan.id))
      charges <- contributionRatePlan.ratePlanCharges.headOption
      amount <- charges.price
    } yield ContributionAmount(amount, charges.currency)

  def fetchContributionAmountFromZuora(supporterRatePlanItem: SupporterRatePlanItem): Future[SupporterRatePlanItem] =
    zuoraService
      .getSubscription(supporterRatePlanItem.subscriptionName)
      .map { sub =>
        val contributionAmount = contributionAmountFromZuoraSubscription(sub)
        logger.info(
          s"Contribution amount for supporter ${supporterRatePlanItem.identityId} is ${contributionAmount}",
        )
        supporterRatePlanItem.copy(contributionAmount = contributionAmount)
      }

}

object ContributionIds {
  def forStage(stage: Stage) = stage match {
    case PROD => List("2c92a0fc5aacfadd015ad24db4ff5e97", "2c92a0fc5e1dc084015e37f58c200eea")
    case CODE => List("2c92c0f85a6b134e015a7fcd9f0c7855", "2c92c0f85e2d19af015e3896e824092c")
  }
}
