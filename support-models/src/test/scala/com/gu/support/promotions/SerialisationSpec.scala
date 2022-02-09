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

  it should "be able to decode a free trial Promotion" in {
    testDecoding[Promotion](
      Fixtures.freeTrialPromotion,
      promotion => {
        promotion.freeTrial.isDefined shouldBe true
        promotion.freeTrial.get.duration shouldBe days(14)
        promotion.renewalOnly shouldBe false
      },
    )
  }

  it should "be able to decode a double benefit Promotion" in {
    testDecoding[Promotion](
      Fixtures.doublePromotion,
      promotion => {
        promotion.freeTrial.isDefined shouldBe true
        promotion.freeTrial.get.duration shouldBe days(14)

        promotion.discount.isDefined shouldBe true
        promotion.discount.get.durationMonths shouldBe Some(months(3))
        promotion.discount.get.amount shouldBe 50.03
      },
    )
  }

  it should "be able to decode a renewal Promotion" in {
    testDecoding[Promotion](Fixtures.renewal, _.renewalOnly shouldBe true)
  }

  it should "be able to decode a double benefit Promotion containing a renewal" in {
    testDecoding[Promotion](
      Fixtures.doubleWithRenewal,
      promotion => {
        promotion.discount.isDefined shouldBe true
        promotion.discount.get.durationMonths shouldBe Some(months(12))
        promotion.discount.get.amount shouldBe 10

        promotion.renewalOnly shouldBe true
      },
    )
  }

  it should "be able to decode a incentive Promotion" in {
    testDecoding[Promotion](
      Fixtures.incentivePromotion,
      promotion => {
        promotion.incentive.isDefined shouldBe true
        promotion.incentive.get.redemptionInstructions shouldBe
          "We'll send you an email with instructions on redeeming your English Heritage offer within 35 days."
      },
    )
  }

  it should "be able to decode an introductory price Promotion" in {
    testDecoding[Promotion](
      Fixtures.introductoryPricePromotion,
      promotion => {
        promotion.introductoryPrice shouldBe defined
        promotion.introductoryPrice.get.price shouldBe 6
        promotion.introductoryPrice.get.periodType shouldBe Issue
        promotion.introductoryPrice.get.periodLength shouldBe 6
      },
    )
  }

  it should "be able to decode a double benefit Promotion containing an incentive" in {
    testDecoding[Promotion](
      Fixtures.doubleWithIncentive,
      promotion => {
        val discount = promotion.discount.get
        discount.durationMonths shouldBe Some(months(3))
        discount.amount shouldBe 50.07

        val incentive = promotion.incentive.get
        incentive.redemptionInstructions shouldBe "Customers will be contacted by email a minimum of 35 days after their subscription start date with the redemption code to claim their incentive."
        incentive.legalTerms shouldBe Some(
          "**Entering the Promotion**\n \n1. The gift card promotion (the “Promotion”) is open to UK residents aged 18 and over (\"you\") subject to paragraph 2 below.\n2. Employees or agencies of Guardian News & Media Limited (\"GNM\", \"We\") and/or their group companies or their family members, or anyone else connected with the promotion may not enter the Promotion. \n3. By entering the promotion you are accepting these terms and conditions.\n4. To enter the promotion, you must: either (i) go to: gu.com/subscriptions/DAC99X or call 0330 333 6767 and quote DAC99X OR (ii) purchase a Digital Pack subscription and maintain that subscription for at least 35 days.\n5. Entry to this promotion is available only to new subscribers: this means that you must not already have a subscription to the Guardian and/or Observer to be eligible to participate in this Promotion.\n6. Please note that purchasing a subscription as referred to in paragraph 4 above will also be subject to the terms and conditions for Guardian and Observer Subscriptions available at: theguardian.com/digital-subscriptions-terms-conditions\n7. The opening date and time of the Promotion is 9am on 31 October 2016. The closing date and time of the promotion is 11.59pm on 22nd December. Purchases after that date and time will not be eligible for the promotion.\n8. If you opt to use the SMS response service to place your order you will be charged your standard network rate.\n9. Subject to successful payment processing of an eligible Guardian Digital Pack subscription, and maintenance of that subscription for at least 35 consecutive days, customers will be eligible to receive a £10 M&S e-gift card.\n10. You will be contacted by Guardian News & Media within 35 days of your eligible subscription commencing to be given details of how to select and claim your Free Gift. You will need to claim your Free Gift within 90 days of receiving your redemption information via email.\n11. Please note that any terms and conditions which apply to the Free Gift are separate to the contract you will enter into when you purchase a subscription as referred to in paragraphs 4 and 6 above.\n12. The Free Gift cannot be exchanged or transferred by you and cannot be redeemed by you for cash or any other free gift or prize. You must pay all other costs associated with the Free Gift and not specifically included in the Free Gift as specified in these terms and conditions.\n13. We retain the right to substitute the Free Gift with another free gift of similar value in the event that the Free Gift is not available for any reason.\n14. Only one entry to this Promotion per person. Entries on behalf of another person will not be accepted.\n15. We take no responsibility for entries that are lost, delayed, misdirected or incomplete or cannot be delivered or entered for any technical or other reason. Proof of delivery of the entry is not proof of receipt. \n16. The Promoter of the Promotion is Guardian News & Media Limited whose address is Kings Place, 90 York Way, London N1 9GU. Any complaints regarding the Promotion should be sent to this address.\n17. Nothing in these terms and conditions shall exclude the liability of GNM for death, personal injury, fraud or fraudulent misrepresentation as a result of its negligence.\n18. GNM accepts no responsibility for any damage, loss, liabilities, injury or disappointment incurred or suffered by you as a result of entering the Promotion or accepting the Free Gift or any substitute if applicable. GNM further disclaims liability for any injury or damage to you or any other person’s computer relating to or resulting from participation in the Promotion. \n19. GNM reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, this Promotion with or without prior notice due to reasons outside its control (including, without limitation, in the case of anticipated, suspected or actual fraud). The decision of 20. GNM in all matters under its control is final and binding.\nGNM shall not be liable for any failure to comply with its obligations where the failure is caused by something outside its reasonable control. Such circumstances shall include, but not be limited to, weather conditions, fire, flood, hurricane, strike, industrial dispute, war, hostilities, political unrest, riots, civil commotion, inevitable accidents, supervening legislation or any other circumstances amounting to force majeure.\n21. The Promotion will be governed by English law.",
        )
        incentive.termsAndConditions shouldBe Some(
          "Offer open to UK mainland residents aged 18+. You must purchase a new Guardian Digital Pack subscription by 11.59pm on 22/12/2016 to be eligible for this offer and maintain the subscription for at least 35 days. Offer is a £10 M&S e-gift card for new Digital Pack subscribers. Please allow 35 days to receive details of how to claim your e-gift card. If you opt to use the SMS response service to place your order you will be charged your standard network rate. Offer subject to availability. In the event stock runs out you may be offered an alternative gift of a similar value or full refund. Customers will be contacted a minimum of 35 days after their subscription start date with the redemption code to claim their incentive offer. This offer ends 22/12/2016 and Guardian and Observer reserve the right to end this offer at any time.",
        )
      },
    )
  }

  it should "be able to roundtrip a promotion" in {
    val appliesTo = AppliesTo(Set(""), Set(Country.UK))
    testRoundTripSerialisation(appliesTo)
    val discountBenefit = new DiscountBenefit(12, None)
    testRoundTripSerialisation(discountBenefit)
    val promotion = Promotion(
      "test",
      "test",
      appliesTo,
      "",
      Map[Channel, Set[PromoCode]]("" -> Set()),
      DateTime.now(ISOChronology.getInstanceUTC),
      None,
      None,
      None,
    )
    import com.gu.support.encoding.CustomCodecs.ISODate.encodeDateTime
    implicit val e: Encoder[Promotion] = deriveEncoder
    testRoundTripSerialisation(promotion)
  }

  it should "be able to decode a landing page" in {
    testDecoding[Promotion](
      Fixtures.doubleWithIncentive,
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
