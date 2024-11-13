package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.i18n.Currency
import com.gu.support.catalog.{CatalogService, ProductRatePlanId}
import com.gu.support.config.{TouchPointEnvironment, ZuoraGuardianLightConfig, ZuoraSupporterPlusConfig}
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.workers.ProductTypeRatePlans.guardianLightRatePlan
import com.gu.support.workers.exceptions.CatalogDataNotFoundException
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.GuardianLightState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api.{RatePlanChargeData, RatePlanChargeOverride, SubscribeItem}
import com.gu.zuora.subscriptionBuilders.ProductSubscriptionBuilders.validateRatePlan

class GuardianLightSubscriptionBuilder(
    config: ZuoraGuardianLightConfig,
    catalogService: CatalogService,
    dateGenerator: DateGenerator,
    environment: TouchPointEnvironment,
    subscribeItemBuilder: SubscribeItemBuilder,
) {
  def build(
      state: GuardianLightState,
      csrUsername: Option[String],
      salesforceCaseId: Option[String],
  ): SubscribeItem = {
    val productRatePlanId =
      validateRatePlan(guardianLightRatePlan(state.product, environment), state.product.describe)

    // This is hardcoded to monthly
    val contributionRatePlanChargeId = config.monthlyChargeId

    val todaysDate = dateGenerator.today
    val subscriptionData = subscribeItemBuilder.buildProductSubscription(
      productRatePlanId = productRatePlanId,
      ratePlanCharges = List(
        RatePlanChargeData(
          RatePlanChargeOverride(
            productRatePlanChargeId = contributionRatePlanChargeId,
            price = getBaseProductPrice(productRatePlanId, state.product.currency),
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
          s"Missing price data for Guardian Light product rateplan with id $productRatePlanId with currency $currency",
        )
    }

}
