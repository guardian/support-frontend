package com.gu.support.acquisitions.calculator

import com.gu.support.acquisitions.models.AcquisitionProduct
import com.gu.support.acquisitions.models.PaymentFrequency.Monthly
import com.gu.support.acquisitions.models.PaymentProvider.Stripe
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class AnnualisedValueTwoCalculatorSpec extends AnyFlatSpec with Matchers with EitherValues {
  "getAnnualisedValue" should "return the annualised value for a Supporter Plus acquisition" in {
    val supporterPlusAcq = AcquisitionModel(
      amount = 20.0,
      product = AcquisitionProduct.SupporterPlus,
      currency = "GBP",
      paymentFrequency = Monthly,
      paymentProvider = Some(Stripe),
      printOptions = None,
    )

    val result = AnnualisedValueTwoCalculator.getAnnualisedValue(supporterPlusAcq)

    result.isRight should be(true)
    result.map { av =>
      val roundedAv = BigDecimal(av).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble
      roundedAv should be(212.61)
    }
  }
}
