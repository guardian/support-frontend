package com.gu.support.promotions

import com.gu.support.catalog.{DigitalPack, Product}
import com.gu.support.config.{Stage, TouchPointEnvironments}
import com.gu.support.encoding.Codec
import org.joda.time.DateTime

case class PromotionTerms(
  promoCode: PromoCode,
  description: String,
  starts: DateTime,
  expires: Option[DateTime],
  product: Product,
  productRatePlans: List[String]
)

object PromotionTerms {

  import com.gu.support.encoding.CustomCodecs.{encodeDateTime, decodeDateTime}

  implicit val codec: Codec[PromotionTerms] = Codec.deriveCodec

  def fromPromoCode(promotionService: PromotionService, stage: Stage, promoCode: PromoCode): Option[PromotionTerms] =
    promotionService.findPromotion(promoCode).map(promotionTermsFromPromotion(stage))


  def promotionTermsFromPromotion(stage: Stage)(promotion: PromotionWithCode): PromotionTerms = {
    val environment = TouchPointEnvironments.fromStage(stage)
    val includedProductRatePlanIds = promotion.promotion.appliesTo.productRatePlanIds

    val product = Product.allProducts.find(_
      .getProductRatePlanIds(environment).toSet
      .intersect(includedProductRatePlanIds)
      .nonEmpty
    ).getOrElse(DigitalPack)

    val productRatePlans = product
      .getProductRatePlans(environment)
      .filter(productRatePlan => includedProductRatePlanIds.contains(productRatePlan.id))
      .map(_.description)

    PromotionTerms(
      promotion.promoCode,
      promotion.promotion.description,
      promotion.promotion.starts,
      promotion.promotion.expires,
      product,
      productRatePlans
    )
  }
}
