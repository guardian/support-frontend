package com.gu.zuora.productHandlers

import com.gu.support.catalog
import com.gu.support.catalog.{CatalogService, Product, ProductRatePlan}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.{CodeRedeemedInThisRequest, CodeStatus, ValidGiftCode}
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionGiftRedemptionState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.{
  SendThankYouEmailDigitalSubscriptionGiftRedemptionState,
  TermDates,
}
import com.gu.support.workers.{BillingPeriod, DigitalPack, User}
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.support.zuora.api.response.{Subscription, ZuoraSubscriptionNumber, ZuoraSuccessOrFailureResponse}
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
      state: DigitalSubscriptionGiftRedemptionState,
  ): Future[SendThankYouEmailState] = {
    val codeValidator = new GiftCodeValidator(zuoraService)
    val zuoraUpdater = new ZuoraUpdater(zuoraService, catalogService)
    for {
      codeValidation <- codeValidator.getStatus(state.redemptionData.redemptionCode, Some(requestId.toString))
      (subscriptionNumber, termDates, billingPeriod) <- codeValidation match {
        case ValidGiftCode(subscriptionId) =>
          zuoraUpdater.doZuoraUpdates(
            subscriptionId,
            zuoraService.updateSubscriptionRedemptionData(
              subscriptionId,
              requestId.toString,
              state.userId,
              LocalDate.now(),
              _,
            ),
          )
        case CodeRedeemedInThisRequest(subscriptionId) =>
          zuoraUpdater.doZuoraUpdates(
            subscriptionId,
            (_: Int) => Future.successful(ZuoraSuccessOrFailureResponse(success = true, None)),
          )
        case otherState: CodeStatus => Future.failed(new RuntimeException(otherState.clientCode))
      }
      // The product.billingPeriod contained in the state is incorrect at this point because we
      // don't know it in support-frontend. Set it to the correct value here so that we can use
      // it in the UpdateSupporterProductData lambda
      productWithCorrectBillingPeriod = DigitalPack(state.product.currency, billingPeriod, Gift)
    } yield SendThankYouEmailDigitalSubscriptionGiftRedemptionState(
      user,
      productWithCorrectBillingPeriod,
      subscriptionNumber.value,
      termDates,
    )
  }

}

class ZuoraUpdater(
    zuoraService: ZuoraGiftService,
    catalogService: CatalogService,
) {
  def doZuoraUpdates(
      subscriptionId: String,
      updateGiftIdentityIdCall: Int => Future[ZuoraSuccessOrFailureResponse],
  ): Future[(ZuoraSubscriptionNumber, TermDates, BillingPeriod)] = for {
    fullGiftSubscription <- zuoraService.getSubscriptionById(subscriptionId)
    productRatePlan <- Future.fromTry(getDigitalSubProductRatePlan(fullGiftSubscription, catalogService))
    calculatedDates <- Future.successful(
      calculateNewTermLength(productRatePlan, fullGiftSubscription.customerAcceptanceDate),
    )
    (dates, newTermLength) = calculatedDates
    _ <- updateGiftIdentityIdCall(newTermLength)
    _ <- zuoraService.setupRevenueRecognition(fullGiftSubscription, dates)
  } yield (ZuoraSubscriptionNumber(fullGiftSubscription.subscriptionNumber), dates, productRatePlan.billingPeriod)

  private def calculateNewTermLength(productRatePlan: ProductRatePlan[Product], customerAcceptanceDate: LocalDate) = {
    val termDates = getStartEndDates(productRatePlan.billingPeriod.monthsInPeriod)
    val newTermLength =
      Days
        .daysBetween(customerAcceptanceDate, termDates.giftEndDate)
        .getDays + 1 // To avoid having to think about time zones
    (termDates, newTermLength)
  }

  private def getDigitalSubProductRatePlan(subscription: Subscription, catalogService: CatalogService) =
    subscription.ratePlans
      .find(ratePlan =>
        catalogService.getProductRatePlanFromId(catalog.DigitalPack, ratePlan.productRatePlanId).isDefined,
      )
      .flatMap(ratePlan => catalogService.getProductRatePlanFromId(catalog.DigitalPack, ratePlan.productRatePlanId))
      .map(Success(_))
      .getOrElse(Failure(new RuntimeException(s"Unable to calculate new term length for subscription $subscription")))

  private def getStartEndDates(months: Int) = {
    val startDate = LocalDate.now()
    val newEndDate = startDate.toDateTimeAtStartOfDay
      .plusMonths(months)
      .toLocalDate
    TermDates(startDate, newEndDate, months)
  }
}
