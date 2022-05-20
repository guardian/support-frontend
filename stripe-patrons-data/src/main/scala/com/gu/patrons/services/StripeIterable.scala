package com.gu.patrons.services

import com.gu.patrons.model.{StripeSubscription, StripeSubscriptionsResponse}
import com.gu.supporterdata.model.SupporterRatePlanItem

import scala.annotation.tailrec
import scala.concurrent.{ExecutionContext, Future}

class StripeIterable(stripeService: StripeService, identityService: PatronsIdentityService)(implicit
    executionContext: ExecutionContext,
) {

  def processSubscriptions =
    processFutureResponse(stripeService.getSubscriptions(10))

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
      .foreach { sub =>
        identityService
          // .getOrCreateUserFromEmail(sub.customer.email, sub.customer.name)
          .getUserIdFromEmail(sub.customer.email)
          .map { identityId =>
            System.out.println(
              s"${sub.customer.email} $identityId ${sub.status} ${sub.created.toString} ${sub.currentPeriodEnd.toString}",
            )
            SupporterRatePlanItem(
              sub.id,
              identityId.getOrElse(""),
              None,
              "guardian_patron",
              "Guardian Patron",
              sub.currentPeriodEnd,
              sub.created,
            )
          }
      }
}
