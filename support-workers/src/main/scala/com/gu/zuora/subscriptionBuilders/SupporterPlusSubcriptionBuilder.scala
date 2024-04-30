package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.i18n.Currency
import com.gu.support.catalog.{CatalogService, ProductRatePlanId}
import com.gu.support.config.{TouchPointEnvironment, ZuoraSupporterPlusConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.Monthly
import com.gu.support.workers.ProductTypeRatePlans.supporterPlusRatePlan
import com.gu.support.workers.exceptions.{BadRequestException, CatalogDataNotFoundException}
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.SupporterPlusState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}
import com.gu.support.catalog.NoFulfilmentOptions

class SupporterPlusSubcriptionBuilder(
    config: ZuoraSupporterPlusConfig,
    promotionService: PromotionService,
    catalogService: CatalogService,
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      state: SupporterPlusState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): Either[PromoError, SubscribeItem] = {
    if (state.product.fulfilmentOptions == NoFulfilmentOptions) {
      createSecondTierSupporterPlus(state, csrUsername, salesforceCaseId)
    } else {
      createThirdTierSupporterPlus(state, csrUsername, salesforceCaseId)
    }
  }

  private def createThirdTierSupporterPlus(
      state: SupporterPlusState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ) = {
    val productRatePlanId =
      validateRatePlan(supporterPlusRatePlan(state.product, environment), state.product.describe)

    if (state.product.amount != getBaseProductPrice(productRatePlanId, state.product.currency)) {
      throw new BadRequestException(
        s"The amount passed in (${state.product.amount}) does not match the price of this product.",
      )
    }

    val todaysDate = dateGenerator.today

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = productRatePlanId,
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = todaysDate,
      readerType = Direct,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.promoCode,
      state.billingCountry,
      productRatePlanId,
      subscriptionData,
    ).map { subscriptionData =>
      subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
    }

  }

  private def createSecondTierSupporterPlus(
      state: SupporterPlusState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ) = {
    val productRatePlanId =
      validateRatePlan(supporterPlusRatePlan(state.product, environment), state.product.describe)
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
      state.promoCode,
      state.billingCountry,
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
