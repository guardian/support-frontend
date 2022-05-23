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
    processFutureResponse(stripeService.getSubscriptions(pageSize))

  final def processFutureResponse(eventualResponse: Future[StripeSubscriptionsResponse]): Future[Unit] = {
    eventualResponse.flatMap { response =>
      processSubs(response.data)
      if (response.hasMore)
        processFutureResponse(
          stripeService.getSubscriptions(startingAfterId = Some(response.data.last.id)),
        )
      else
        Future.successful(())
    }
  }

  def processSubs(list: List[StripeSubscription]): Unit =
    list
      .filterNot(sub =>
        sub.customer.email.contains("@guardian.co.uk") || sub.customer.email.contains("@theguardian.com"),
      )
      .distinctBy(
        _.customer.email, // I think this is probably only an issue in dev, but there can be multiple subs with the same email
      )
      .foreach(subscriptionProcessor.processSubscription)
}

trait SubscriptionProcessor {
  def processSubscription(subscription: StripeSubscription)
}

class IdentityDynamoProcessor(
    identityService: PatronsIdentityService,
    supporterDataDynamoService: SupporterDataDynamoService,
) extends SubscriptionProcessor {
  import scala.concurrent.ExecutionContext.Implicits.global
  override def processSubscription(subscription: StripeSubscription): Unit =
    for {
      identityId <- identityService.getOrCreateUserFromEmail(subscription.customer.email, subscription.customer.name)
      dynamoResponse <- writeToDynamo(identityId, subscription)
    } yield {
      logDynamoResult(subscription.customer.email, dynamoResponse)
      ()
    }

  def writeToDynamo(identityId: String, sub: StripeSubscription) = {
    System.out.println(
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

  def logDynamoResult(email: String, updateDynamoState: UpdateItemResponse) =
    if (updateDynamoState.sdkHttpResponse().statusCode() == 200)
      SafeLogger.info(s"Dynamo record successfully written for ${email}")
    else
      SafeLogger.info(
        s"Error response from Dynamo for ${email}. Status code was ${updateDynamoState.sdkHttpResponse().statusCode()}",
      )
}
