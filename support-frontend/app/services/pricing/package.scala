package services

import com.gu.i18n.{CountryGroup, Currency}
import com.gu.support.catalog.{FulfilmentOptions, ProductOptions}
import com.gu.support.workers.BillingPeriod

package object pricing {
  type CountryGroupPrices = Map[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, Map[Currency, PriceSummary]]]]
  type ProductPrices = Map[CountryGroup, CountryGroupPrices]
}
