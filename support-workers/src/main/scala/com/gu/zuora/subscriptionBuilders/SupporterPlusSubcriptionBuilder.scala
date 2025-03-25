package com.gu.zuora.subscriptionBuilders

import cats.syntax.either._
import com.gu.helpers.DateGenerator
import com.gu.i18n.Currency
import com.gu.support.catalog.{CatalogService, ProductRatePlanId}
import com.gu.support.config.{TouchPointEnvironment, ZuoraSupporterPlusConfig}
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.ProductTypeRatePlans.supporterPlusRatePlan
import com.gu.support.workers.exceptions.{BadRequestException, CatalogDataNotFoundException}
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.{Monthly, SupporterPlus}
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.{applyPromoCodeIfPresent, validateRatePlan}

class SupporterPlusSubcriptionBuilder(
    config: ZuoraSupporterPlusConfig,
    promotionService: PromotionService,
    catalogService: CatalogService,
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      product: SupporterPlus,
      state: CreateZuoraSubscriptionState,
  ): Either[String, SubscribeItem] = {
    val productRatePlanId =
      validateRatePlan(supporterPlusRatePlan(product, environment), product.describe)
    val contributionRatePlanChargeId =
      if (product.billingPeriod == Monthly) config.v2.monthlyContributionChargeId
      else config.v2.annualContributionChargeId
    val todaysDate = dateGenerator.today

    val contributionAmount = product.amount - getBaseProductPrice(productRatePlanId, product.currency)
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
      csrUsername = state.csrUsername,
      salesforceCaseId = state.salesforceCaseId,
    )

    applyPromoCodeIfPresent(
      promotionService,
      state.appliedPromotion,
      productRatePlanId,
      subscriptionData,
    ).map { subscriptionData =>
      subscribeItemBuilder.build(subscriptionData, state.salesForceContacts.recipient, Some(state.paymentMethod), None)
    }.leftMap(_.toString)
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
