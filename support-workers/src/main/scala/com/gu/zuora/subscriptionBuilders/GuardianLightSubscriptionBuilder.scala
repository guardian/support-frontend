package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.support.catalog.CatalogService
import com.gu.support.config.{TouchPointEnvironment, ZuoraSupporterPlusConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianLightState
import com.gu.support.zuora.api.SubscribeItem
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.validateRatePlan

class GuardianLightSubscriptionBuilder(
    config: ZuoraSupporterPlusConfig,
    promotionService: PromotionService,
    catalogService: CatalogService,
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {
  def build(
      state: GuardianLightState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Either[PromoError, SubscribeItem] = {
    val productRatePlanId =
      validateRatePlan(guardianLightRatePlan(state.product, environment), state.product.describe)
    val contributionRatePlanChargeId =
      if (state.product.billingPeriod == Monthly) config.v2.monthlyContributionChargeId
      else config.v2.annualContributionChargeId
    val todaysDate = dateGenerator.today

    val contributionAmount = state.product.amount - getBaseProductPrice(productRatePlanId, state.product.currency)
    if (contributionAmount < 0)
      throw new BadRequestException(
        s"The contribution amount of a supporter plus subscription cannot be less than zero, but here it would be $contributionAmount",
      )

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = productRatePlanId,
      ratePlanCharges = List(
        RatePlanChargeData(
          RatePlanChargeOverride(
            contributionRatePlanChargeId,
            price = contributionAmount, // Pass the amount of the cost which counts as a contribution into Zuora
          ),
        ),
      ),
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = todaysDate,
      readerType = Direct,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.appliedPromotion,
      productRatePlanId,
      subscriptionData,
    ).map { subscriptionData =>
      subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
    }
  }

  private def getBaseProductPrice(productRatePlanId: ProductRatePlanId, currency: Currency) =
    (for {
      priceList <- catalogService.getPriceList(productRatePlanId)
      price <- priceList.prices.find(_.currency == currency)
    } yield price.value) match {
      case Some(amount) => amount
      case _ =>
        throw new CatalogDataNotFoundException(
          s"Missing price data for supporter plus product rateplan with id $productRatePlanId with currency $currency",
        )
    }

}
