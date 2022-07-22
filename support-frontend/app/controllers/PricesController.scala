package controllers

import actions.CustomActionBuilders
import com.gu.i18n.{CountryGroup, Currency}
import services.pricing.{PriceSummary, PriceSummaryServiceProvider, ProductPrices}
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
  case class RatePlanPriceData(
      price: String, // the offered price on the site right now
      currency: String, // never quote a price without a currency, even if grouped
      priceSummary: Option[PriceSummary],
  )

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

  private def buildRatePlanPriceData(priceSummary: PriceSummary, includeSummary: Boolean): RatePlanPriceData = {
    val topPromotion = priceSummary.promotions.headOption
    val price = topPromotion
      .flatMap(_.discountedPrice)
      .getOrElse(priceSummary.price)

    RatePlanPriceData(
      price = price.toString,
      currency = priceSummary.currency.identifier,
      priceSummary =
        Option.when(includeSummary)(priceSummary.copy(promotions = topPromotion.map(_.copy(landingPage = None)).toList)),
    )
  }

  def buildProductPriceData(
      productPrices: ProductPrices,
      countryGroup: CountryGroup,
      currency: Currency,
      fulfilmentOptions: FulfilmentOptions,
      includeSummary: Boolean,
  ): Option[ProductPriceData] =
    for {
      countryGroupPrices <- productPrices.get(countryGroup)
      fulfilmentPrices <- countryGroupPrices.get(fulfilmentOptions)
      productOptionPrices <- fulfilmentPrices.get(NoProductOptions)
      monthlyPriceSummary <- productOptionPrices.get(Monthly).flatMap(_.get(currency))
      annualPriceSummary <- productOptionPrices.get(Annual).flatMap(_.get(currency))
    } yield ProductPriceData(
      Monthly = buildRatePlanPriceData(monthlyPriceSummary, includeSummary),
      Annual = buildRatePlanPriceData(annualPriceSummary, includeSummary),
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
      includeSummary: Boolean,
  ): CountryGroupPriceData = {
    val guardianWeeklyProductPrices = priceSummaryServiceProvider
      .forUser(false)
      .getPrices(GuardianWeekly, Nil, Direct)
    val digisubProductPrices = priceSummaryServiceProvider
      .forUser(false)
      .getPrices(DigitalPack, DefaultPromotions.DigitalSubscription.all, Direct)

    CountryGroupPriceData(
      GuardianWeekly =
        buildProductPriceData(guardianWeeklyProductPrices, countryGroup, currency, Domestic, includeSummary),
      Digisub = buildProductPriceData(digisubProductPrices, countryGroup, currency, NoFulfilmentOptions, includeSummary),
    )
  }

  private def getPrices(includeSummary: Boolean): Prices = {
    Prices(
      GBPCountries = buildCountryGroupPriceData(CountryGroup.UK, GBP, includeSummary),
      UnitedStates = buildCountryGroupPriceData(CountryGroup.US, USD, includeSummary),
      EURCountries = buildCountryGroupPriceData(CountryGroup.Europe, EUR, includeSummary),
      AUDCountries = buildCountryGroupPriceData(CountryGroup.Australia, AUD, includeSummary),
      International = buildCountryGroupPriceData(CountryGroup.RestOfTheWorld, USD, includeSummary),
      NZDCountries = buildCountryGroupPriceData(CountryGroup.NewZealand, NZD, includeSummary),
      Canada = buildCountryGroupPriceData(CountryGroup.Canada, CAD, includeSummary),
    )
  }

  def getPrices: Action[AnyContent] = NoCacheAction() { implicit request =>
    val includeSummary = request.getQueryString("include-summary").nonEmpty
    Ok(getPrices(includeSummary).asJson)
  }
}
