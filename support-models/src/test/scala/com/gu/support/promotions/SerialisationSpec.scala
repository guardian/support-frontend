package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.SerialisationTestHelpers
import com.typesafe.scalalogging.LazyLogging
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import org.joda.time.DateTime
import org.joda.time.Days.days
import org.joda.time.Months.months
import org.joda.time.chrono.ISOChronology
import org.joda.time.format.ISODateTimeFormat
import org.scalatest.flatspec.AsyncFlatSpec

//noinspection ScalaStyle
class SerialisationSpec extends AsyncFlatSpec with SerialisationTestHelpers with LazyLogging {

  "Circe" should "be able to decode a discount Promotion" in {
    testDecoding[Promotion](
      Fixtures.discountPromotion,
      promotion => {
        promotion.starts.dayOfMonth.get shouldBe 3
        promotion.starts.monthOfYear.get shouldBe 10
        promotion.starts.year.get shouldBe 2018
        promotion.discount.isDefined shouldBe true
        promotion.discount.get.durationMonths shouldBe Some(months(12))
        promotion.discount.get.amount shouldBe 30
      },
    )
  }

  it should "be able to roundtrip a promotion" in {
    val appliesTo = AppliesTo(Set(""), Set(Country.UK))
    testRoundTripSerialisation(appliesTo)
    val discountBenefit = new DiscountBenefit(12, None)
    testRoundTripSerialisation(discountBenefit)
    val promotion = Promotion(
      name = "test",
      description = "test",
      appliesTo = appliesTo,
      campaignCode = "",
      promoCode = "",
      starts = DateTime.now(ISOChronology.getInstanceUTC),
      expires = None,
      discount = None,
      freeTrial = None,
    )
    import com.gu.support.encoding.CustomCodecs.ISODate.encodeDateTime
    implicit val e: Encoder[Promotion] = deriveEncoder
    testRoundTripSerialisation(promotion)
  }

  it should "be able to decode a landing page" in {
    testDecoding[Promotion](
      Fixtures.discountPromotion,
      promotion => {
        val landingPage = promotion.landingPage.get
        landingPage.title shouldBe Some("Get 50% off the Guardian Digital Pack for 3 months")
        landingPage.description shouldBe Some(
          "Enjoy the digital pack for half price.\n\nSubscribe before 22nd December 2016 and get the Digital Pack for just £5.99 for the first 3 months (standard price of £11.99 a month will apply after). \n\nNew UK digital pack subscribers also receive a £10 M&S e-gift card. Terms and conditions apply.",
        )
        landingPage.roundel shouldBe Some("### 50% off for 3 months")
      },
    )
  }
}
