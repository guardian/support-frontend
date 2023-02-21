package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.helpers.SupportWorkersV2Helper.isV2SupporterPlus
import com.gu.i18n.Currency
import com.gu.support.acquisitions.AbTest
import com.gu.support.catalog.{CatalogService, Pricelist, ProductRatePlanId, SupporterPlus}
import com.gu.support.config.{TouchPointEnvironment, ZuoraSupporterPlusConfig}
import com.gu.support.workers.{BillingPeriod, Monthly}
import com.gu.support.workers.ProductTypeRatePlans.{supporterPlusRatePlanV1, supporterPlusRatePlanV2}
import com.gu.support.workers.exceptions.CatalogDataNotFoundException
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.SupporterPlusState
import com.gu.support.zuora.api._
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.validateRatePlan

class SupporterPlusSubcriptionBuilder(
    config: ZuoraSupporterPlusConfig,
    catalogService: CatalogService,
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {

  def build(
      state: SupporterPlusState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
      abTests: Option[Set[AbTest]],
  ): SubscribeItem =
    if (isV2SupporterPlus(abTests))
      buildV2(state, csrUsername, salesforceCaseId)
    else
      buildV1(state, csrUsername, salesforceCaseId)

  def buildV1(state: SupporterPlusState, csrUsername: Option[String], salesforceCaseId: Option[String]) = {
    val productRatePlanId =
      validateRatePlan(supporterPlusRatePlanV1(state.product, environment), state.product.describe)
    val ratePlanChargeId = if (state.product.billingPeriod == Monthly) config.monthlyChargeId else config.annualChargeId
    val todaysDate = dateGenerator.today

    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = productRatePlanId,
      ratePlanCharges = List(
        RatePlanChargeData(
          RatePlanChargeOverride(
            ratePlanChargeId,
            price = state.product.amount, // Pass the amount the user selected into Zuora
          ),
        ),
      ),
      contractEffectiveDate = todaysDate,
      contractAcceptanceDate = todaysDate,
      readerType = Direct,
      csrUsername = csrUsername,
      salesforceCaseId = salesforceCaseId,
    )
    subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)
  }
  def buildV2(state: SupporterPlusState, csrUsername: Option[String], salesforceCaseId: Option[String]) = {
    val productRatePlanId =
      validateRatePlan(supporterPlusRatePlanV2(state.product, environment), state.product.describe)
    val contributionRatePlanChargeId =
      if (state.product.billingPeriod == Monthly) config.v2.monthlyContributionChargeId
      else config.v2.annualContributionChargeId
    val todaysDate = dateGenerator.today

    val contributionAmount = state.product.amount - getBaseProductPrice(productRatePlanId, state.product.currency)
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
    subscribeItemBuilder.build(subscriptionData, state.salesForceContact, Some(state.paymentMethod), None)

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
