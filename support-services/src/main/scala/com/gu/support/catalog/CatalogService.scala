package com.gu.support.catalog

import com.gu.aws.{AwsCloudWatchMetricPut, AwsCloudWatchMetricSetup}
import com.gu.support.catalog.GuardianWeekly.postIntroductorySixForSixBillingPeriod
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers.{Annual, BillingPeriod, Quarterly, SixWeekly}
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import com.typesafe.scalalogging.LazyLogging

object CatalogService {
  def apply(environment: TouchPointEnvironment): CatalogService =
    new CatalogService(environment, new S3CatalogProvider(environment))
}

class CatalogService(val environment: TouchPointEnvironment, jsonProvider: CatalogJsonProvider) extends LazyLogging {

  def getProductRatePlan(
      product: Product,
      billingPeriod: BillingPeriod,
      fulfilmentOptions: FulfilmentOptions,
      productOptions: ProductOptions,
      readerType: ReaderType = Direct,
  ) =
    product.getProductRatePlan(environment, billingPeriod, fulfilmentOptions, productOptions, readerType)

  private[this] def getGWRatePlanId(billingPeriod: BillingPeriod, fulfilmentOptions: FulfilmentOptions) =
    getProductRatePlan(GuardianWeekly, billingPeriod, fulfilmentOptions, NoProductOptions).map(_.id).getOrElse("")

  private[this] def fetchQuarterlyPrice(
      quarterlyId: ProductRatePlanId,
      sixWeeklyPriceList: Pricelist,
      catalogPrices: List[Pricelist],
  ) = {
    Pricelist(
      sixWeeklyPriceList.productRatePlanId,
      sixWeeklyPriceList.savingVsRetail,
      catalogPrices.find(_.productRatePlanId == quarterlyId).map(_.prices).getOrElse(sixWeeklyPriceList.prices),
    )
  }

  def adjustSixWeeklyPriceList(c: Catalog): Catalog = {
    // The price stored for the 6 weekly billing period in Zuora is £6 - the price of the
    // promotion. It is much more use from the point of view of the site to have the subscription
    // price, ie. the quarterly price as the £6 is available through the introductory promotion object
    val ratePlanIdsToSwap = Map(
      getGWRatePlanId(SixWeekly, Domestic) -> getGWRatePlanId(postIntroductorySixForSixBillingPeriod, Domestic),
      getGWRatePlanId(SixWeekly, RestOfWorld) -> getGWRatePlanId(postIntroductorySixForSixBillingPeriod, RestOfWorld),
    )

    Catalog(
      c.prices.map(priceList =>
        ratePlanIdsToSwap
          .get(priceList.productRatePlanId)
          .map(fetchQuarterlyPrice(_, priceList, c.prices))
          .getOrElse(priceList),
      ),
    )
  }

  private lazy val catalog = {

    jsonProvider.get.flatMap { json =>
      val attempt = json.as[ZuoraCatalog].map(Catalog.convert)
      attempt.fold(
        err => {
          logger.error(s"Failed to load the catalog, error was: $err")
          AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(
            AwsCloudWatchMetricSetup.catalogFailureRequest(environment),
          )
          None
        },
        c => {
          logger.info(s"Successfully loaded the catalog")
          Some(adjustSixWeeklyPriceList(c))
        },
      )
    }
  }

  def getProductRatePlanFromId[T <: Product](product: T, id: ProductRatePlanId): Option[ProductRatePlan[Product]] = {
    // These can be removed when all gift subs have been switched over from the recurring charge to the one-time charge
    val legacyDigitalGiftRatePlans = List(
      ProductRatePlan(
        "2c92a0ff73add07f0173b99f14390afc",
        Quarterly,
        NoFulfilmentOptions,
        NoProductOptions,
        "Digital Subscription Three Month Gift",
        readerType = Gift,
      ),
      ProductRatePlan(
        "2c92a00773adc09d0173b99e4ded7f45",
        Annual,
        NoFulfilmentOptions,
        NoProductOptions,
        "Digital Subscription One Year Gift",
        readerType = Gift,
      ),
    )
    (product.ratePlans(environment) ++ legacyDigitalGiftRatePlans).find(_.id == id)
  }

  def getPriceList[T <: Product](productRatePlanId: ProductRatePlanId): Option[Pricelist] =
    catalog.flatMap(_.prices.find(_.productRatePlanId == productRatePlanId))

}
