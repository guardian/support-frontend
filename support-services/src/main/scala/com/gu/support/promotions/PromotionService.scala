package com.gu.support.promotions

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.{GuardianWeekly, ProductRatePlanId}
import com.gu.support.config.PromotionsConfig
import com.gu.support.promotions.PromotionValidator.PromotionExtensions
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.zuora.api.SubscriptionData
import com.typesafe.scalalogging.LazyLogging
import org.joda.time.DateTime

class PromotionService(config: PromotionsConfig, maybeCollection: Option[PromotionCollection] = None) extends TouchpointService with LazyLogging {
  val promotionCollection = maybeCollection.getOrElse(new DynamoPromotionCollection(config.tables))

  val SixForSixPromotion = Promotion(
    "Six for Six",
    "Introductory offer",
    AppliesTo(
      Set(
        "2c92a0086619bf8901661ab02752722f",
        "2c92a0fe6619b4b301661aa494392ee2",
        "2c92c0f9660fc4d70166109c01465f10",
        "2c92c0f8660fb5d601661081ea010391",
        "2c92c0f965f2122101660fb81b745a06",
        "2c92c0f965dc30640165f150c0956859"
      ),
      CountryGroup.countries.toSet
    ),
    "Six For Six campaign code",
    Map("dummy channel" -> Set(GuardianWeekly.SixForSixPromoCode)),
    new DateTime(1971, 2, 20, 12, 0, 0, 0),
    None,
    None, None, None,
    Some(IntroductoryPriceBenefit(6, 6, Issue))
  )

  private def allWith6For6 = promotionCollection.all.toList :+ SixForSixPromotion

  def findPromotion(promoCode: PromoCode): Option[PromotionWithCode] =
    allWith6For6
      .find(_.promoCodes.exists(_ == promoCode))
      .map(PromotionWithCode(promoCode, _))

  def findPromotions(promoCodes: List[PromoCode]): List[PromotionWithCode] =
    allWith6For6
      .foldLeft(List.empty[PromotionWithCode]) {
        (acc, promotion) =>
          val maybeCode = promoCodes.intersect(promotion.promoCodes.toList).headOption
          maybeCode.map(code => acc :+ PromotionWithCode(code, promotion)).getOrElse(acc)
      }

  def validatePromotion(promotion: PromotionWithCode, country: Country, productRatePlanId: ProductRatePlanId, isRenewal: Boolean):
  Either[PromoError, PromotionWithCode] =
    promotion.promotion.validateFor(productRatePlanId, country, isRenewal)
      .headOption
      .map(err => Left(err))
      .getOrElse(Right(promotion))

  def applyPromotion(
    promotion: PromotionWithCode,
    country: Country,
    productRatePlanId: ProductRatePlanId,
    subscriptionData: SubscriptionData,
    isRenewal: Boolean
  ): SubscriptionData =
    validatePromotion(promotion, country, productRatePlanId, isRenewal)
      .map(PromotionApplicator(_, config.discount).applyTo(subscriptionData))
      .toOption.getOrElse(subscriptionData)

}
