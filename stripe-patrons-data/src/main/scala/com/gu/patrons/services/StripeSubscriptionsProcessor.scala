package com.gu.patrons.services

import com.gu.monitoring.SafeLogger
import com.gu.patrons.model.{StripeSubscription, StripeSubscriptionsResponse}
import com.gu.supporterdata.model.SupporterRatePlanItem
import com.gu.supporterdata.services.SupporterDataDynamoService
import software.amazon.awssdk.services.dynamodb.model.UpdateItemResponse

import scala.concurrent.{ExecutionContext, Future}

class StripeSubscriptionsProcessor(
    stripeService: PatronsStripeService,
    subscriptionProcessor: SubscriptionProcessor,
)(implicit
    executionContext: ExecutionContext,
) {

  def processSubscriptions(pageSize: Int) =
    processFutureResponse(pageSize, None)

  final def processFutureResponse(pageSize: Int, startingAfterId: Option[String]): Future[Unit] =
    for {
      response <- stripeService.getSubscriptions(pageSize, startingAfterId)
      _ <- processSubs(response.data)
      result <-
        if (response.hasMore)
          processFutureResponse(pageSize, Some(response.data.last.id))
        else
          Future.successful(())
    } yield result

  def processSubs(list: List[StripeSubscription]) = {
    val unknownEmailViaCSR = "patrons@theguardian.com"
    Future.sequence(
      list
        .filterNot(sub => sub.customer.email == unknownEmailViaCSR)
        .distinctBy(
          _.customer.email, // I think this is probably only an issue in dev, but there can be multiple subs with the same email
        )
        .map(subscriptionProcessor.processSubscription),
    )
  }
}

trait SubscriptionProcessor {
  def processSubscription(subscription: StripeSubscription): Future[Unit]
}

abstract class DynamoProcessor(
    supporterDataDynamoService: SupporterDataDynamoService,
) extends SubscriptionProcessor {
  import scala.concurrent.ExecutionContext.Implicits.global

  def writeToDynamo(identityId: String, sub: StripeSubscription) = {
    SafeLogger.info(
      s"Attempting to write subscription (${sub.customer.email}, $identityId) to Dynamo",
    )
    supporterDataDynamoService
      .writeItem(
        SupporterRatePlanItem(
          sub.id,
          identityId,
          None,
          "guardian_patron",
          "Guardian Patron",
          sub.currentPeriodEnd,
          sub.created,
        ),
      )
  }

  def logDynamoResult(email: String, addSubscriptionsToQueueState: UpdateItemResponse) =
    if (addSubscriptionsToQueueState.sdkHttpResponse().statusCode() == 200)
      SafeLogger.info(s"Dynamo record successfully written for ${email}")
    else
      SafeLogger.info(
        s"Error response from Dynamo for ${email}. Status code was ${addSubscriptionsToQueueState.sdkHttpResponse().statusCode()}",
      )
}

class CreateMissingIdentityProcessor(
    identityService: PatronsIdentityService,
    supporterDataDynamoService: SupporterDataDynamoService,
) extends DynamoProcessor(supporterDataDynamoService) {
  import scala.concurrent.ExecutionContext.Implicits.global

  override def processSubscription(subscription: StripeSubscription) =
    for {
      identityId <- identityService.getOrCreateUserFromEmail(subscription.customer.email, subscription.customer.name)
      dynamoResponse <- writeToDynamo(identityId, subscription)
      _ = logDynamoResult(subscription.customer.email, dynamoResponse)
    } yield {
      ()
    }
}

// If we want to only add patrons who already have an identity account to the datastore and skip those who don't
// we can use this processor rather than the CreateMissingIdentityProcessor class above
class SkipMissingIdentityProcessor(
    identityService: PatronsIdentityService,
    supporterDataDynamoService: SupporterDataDynamoService,
) extends DynamoProcessor(supporterDataDynamoService) {
  import scala.concurrent.ExecutionContext.Implicits.global

  override def processSubscription(subscription: StripeSubscription) =
    identityService.getUserIdFromEmail(subscription.customer.email).map {
      case Some(identityId) =>
        writeToDynamo(identityId, subscription).map(response => logDynamoResult(subscription.customer.email, response))
      case None => Future.successful(())
    }
}
