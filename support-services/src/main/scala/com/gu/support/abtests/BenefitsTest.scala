package com.gu.support.abtests

import com.gu.i18n.Currency
import com.gu.i18n.Currency.{CAD, EUR, GBP, NZD, USD}
import com.gu.support.acquisitions.AbTest
import com.gu.support.workers.{Annual, BillingPeriod, DigitalPack, Monthly}

object BenefitsTest {
  def isValidBenefitsTestPurchase(product: DigitalPack, maybeAbTests: Option[Set[AbTest]]) =
    isUserInBenefitsTestVariants(maybeAbTests) &&
      product.amount.exists(amount => priceIsHighEnough(amount, product.billingPeriod, product.currency))

  def isUserInBenefitsTestVariants(maybeAbTests: Option[Set[AbTest]]) =
    maybeAbTests.exists(
      _.toList.exists(test => test.name == "PP_V3" && (test.variant == "V2_BULLET" || test.variant == "V1_PARAGRAPH")),
    )

  def priceIsHighEnough(amount: BigDecimal, billingPeriod: BillingPeriod, currency: Currency) = {
    val requiredAmount = (billingPeriod, currency) match {
      case (Monthly, GBP) => 12
      case (Annual, GBP) => 119
      case (Monthly, USD) => 20
      case (Annual, USD) => 199
      case (Monthly, EUR) => 15
      case (Annual, EUR) => 149
      case (Monthly, NZD) => 24
      case (Annual, NZD) => 235
      case (Monthly, CAD) => 22
      case (Annual, CAD) => 219
      case _ => Int.MaxValue
    }
    amount >= requiredAmount
  }

}
