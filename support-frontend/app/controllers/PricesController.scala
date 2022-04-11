package controllers

import actions.CustomActionBuilders
import com.gu.i18n.{CountryGroup, Currency}
import com.gu.support.pricing.{PriceSummary, PriceSummaryServiceProvider, ProductPrices}
import io.circe.Encoder
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import PricesController._
import com.gu.i18n.Currency.{AUD, CAD, EUR, GBP, NZD, USD}
import com.gu.support.catalog.{
  DigitalPack,
  Domestic,
  FulfilmentOptions,
  GuardianWeekly,
  NoFulfilmentOptions,
  NoProductOptions,
}
import com.gu.support.promotions.DefaultPromotions
import com.gu.support.workers.{Annual, Monthly}
import com.gu.support.zuora.api.ReaderType.Direct

object PricesController {
  case class RatePlanPriceData(price: String)

  case class ProductPriceData(
      Monthly: RatePlanPriceData,
      Annual: RatePlanPriceData,
  )

  case class CountryGroupPriceData(
      GuardianWeekly: Option[ProductPriceData],
      Digisub: Option[ProductPriceData],
  )

  /** This is the model that we return from the prices endpoint. It gives us what we need for displaying prices in
    * Dotcom messages. It is simpler than the internal com.gu.support.ProductPrices model.
    */
  case class Prices(
      GBPCountries: CountryGroupPriceData,
      UnitedStates: CountryGroupPriceData,
      EURCountries: CountryGroupPriceData,
      AUDCountries: CountryGroupPriceData,
      International: CountryGroupPriceData,
      NZDCountries: CountryGroupPriceData,
      Canada: CountryGroupPriceData,
  )

  def buildRatePlanPriceData(priceSummary: PriceSummary): RatePlanPriceData = {
    val price = priceSummary.promotions.headOption
      .flatMap(_.discountedPrice)
      .getOrElse(priceSummary.price)

    RatePlanPriceData(price.toString)
  }

  def buildProductPriceData(
      productPrices: ProductPrices,
      countryGroup: CountryGroup,
      currency: Currency,
      fulfilmentOptions: FulfilmentOptions,
  ): Option[ProductPriceData] =
    for {
      countryGroupPrices <- productPrices.get(countryGroup)
      fulfilmentPrices <- countryGroupPrices.get(fulfilmentOptions)
      productOptionPrices <- fulfilmentPrices.get(NoProductOptions)
      monthlyPriceSummary <- productOptionPrices.get(Monthly).flatMap(_.get(currency))
      annualPriceSummary <- productOptionPrices.get(Annual).flatMap(_.get(currency))
    } yield ProductPriceData(
      Monthly = buildRatePlanPriceData(monthlyPriceSummary),
      Annual = buildRatePlanPriceData(annualPriceSummary),
    )

  import io.circe.generic.auto._
  implicit val pricesEncoder = Encoder[Prices]
}

class PricesController(
    priceSummaryServiceProvider: PriceSummaryServiceProvider,
    actionRefiners: CustomActionBuilders,
    components: ControllerComponents,
) extends AbstractController(components)
    with Circe {

  import actionRefiners._

  private def buildCountryGroupPriceData(
      countryGroup: CountryGroup,
      currency: Currency,
  ): CountryGroupPriceData = {
    val guardianWeeklyProductPrices = priceSummaryServiceProvider
      .forUser(false)
      .getPrices(GuardianWeekly, DefaultPromotions.GuardianWeekly.NonGift.all, Direct)
    val digisubProductPrices = priceSummaryServiceProvider
      .forUser(false)
      .getPrices(DigitalPack, DefaultPromotions.DigitalSubscription.all, Direct)

    CountryGroupPriceData(
      GuardianWeekly = buildProductPriceData(guardianWeeklyProductPrices, countryGroup, currency, Domestic),
      Digisub = buildProductPriceData(digisubProductPrices, countryGroup, currency, NoFulfilmentOptions),
    )
  }

  def getPrices: Action[AnyContent] = CachedAction() {
    val prices = Prices(
      GBPCountries = buildCountryGroupPriceData(CountryGroup.UK, GBP),
      UnitedStates = buildCountryGroupPriceData(CountryGroup.US, USD),
      EURCountries = buildCountryGroupPriceData(CountryGroup.Europe, EUR),
      AUDCountries = buildCountryGroupPriceData(CountryGroup.Australia, AUD),
      International = buildCountryGroupPriceData(CountryGroup.RestOfTheWorld, USD),
      NZDCountries = buildCountryGroupPriceData(CountryGroup.NewZealand, NZD),
      Canada = buildCountryGroupPriceData(CountryGroup.Canada, CAD),
    )
    Ok(prices.asJson)
  }
}
