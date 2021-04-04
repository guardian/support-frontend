package com.gu.zuora.productHandlers

import com.gu.support.catalog
import com.gu.support.catalog.CatalogService
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.{CodeRedeemedInThisRequest, CodeStatus, ValidGiftCode}
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionState.CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.{SendThankYouEmailDigitalSubscriptionGiftRedemptionState, TermDates}
import com.gu.support.zuora.api.response.{Subscription, ZuoraSuccessOrFailureResponse}
import com.gu.zuora.ZuoraGiftService
import org.joda.time.{Days, LocalDate}

import java.util.UUID
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

class ZuoraDigitalSubscriptionGiftRedemptionHandler(
  zuoraService: ZuoraGiftService,
  catalogService: CatalogService,
  user: User,
  requestId: UUID,
) {

  def redeemGift(
    state: CreateZuoraSubscriptionDigitalSubscriptionGiftRedemptionState,
  ): Future[SendThankYouEmailState] = {
    val codeValidator = new GiftCodeValidator(zuoraService)
    val zuoraUpdater = new ZuoraUpdater(zuoraService, catalogService)
    for {
      codeValidation <- codeValidator.getStatus(state.redemptionData.redemptionCode, Some(requestId.toString))
      termDates <- codeValidation match {
        case ValidGiftCode(subscriptionId) => zuoraUpdater.doZuoraUpdates(
          subscriptionId,
          zuoraService.updateSubscriptionRedemptionData(subscriptionId, requestId.toString, state.userId, LocalDate.now(), _),
        )
        case CodeRedeemedInThisRequest(subscriptionId) => zuoraUpdater.doZuoraUpdates(
          subscriptionId,
          (_: Int) => Future.successful(ZuoraSuccessOrFailureResponse(success = true, None)),
        )
        case otherState: CodeStatus => Future.failed(new RuntimeException(otherState.clientCode))
      }
    } yield SendThankYouEmailDigitalSubscriptionGiftRedemptionState(user, state.product, termDates)
  }

}

class ZuoraUpdater(
  zuoraService: ZuoraGiftService,
  catalogService: CatalogService
) {
  def doZuoraUpdates(
    subscriptionId: String,
    updateGiftIdentityIdCall: Int => Future[ZuoraSuccessOrFailureResponse]
  ): Future[TermDates] = for {
    fullGiftSubscription <- zuoraService.getSubscriptionById(subscriptionId)
    calculatedDates <- Future.fromTry(calculateNewTermLength(fullGiftSubscription, catalogService))
    (dates, newTermLength) = calculatedDates
    _ <- updateGiftIdentityIdCall(newTermLength)
    _ <- zuoraService.setupRevenueRecognition(fullGiftSubscription, dates)
  } yield dates


  private def calculateNewTermLength(subscription: Subscription, catalogService: CatalogService) = {
    (for {
      ratePlan <- subscription.ratePlans.headOption
      productRatePlan <- catalogService.getProductRatePlanFromId(catalog.DigitalPack, ratePlan.productRatePlanId)
    } yield {
      val termDates = getStartEndDates(productRatePlan.billingPeriod.monthsInPeriod)
      val newTermLength = Days.daysBetween(subscription.customerAcceptanceDate, termDates.giftEndDate).getDays + 1 //To avoid having to think about time zones
      Success((termDates, newTermLength))
    }).getOrElse(Failure(new RuntimeException(s"Unable to calculate new term length for subscription ${subscription}")))

  }

  private def getStartEndDates(months: Int) = {
    val startDate = LocalDate.now()
    val newEndDate = startDate
      .toDateTimeAtStartOfDay
      .plusMonths(months)
      .toLocalDate
    TermDates(startDate, newEndDate, months)
  }
}
