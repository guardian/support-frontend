package com.gu.zuora.subscriptionBuilders

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.support.acquisitions.{AbTest, AcquisitionData, OphanIds, ReferrerAcquisitionData}
import com.gu.support.config.ZuoraContributionConfig
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.ContributionState
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, LocalDate}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import java.util.UUID

class ContributionBuilderSpec extends AnyFlatSpec with Matchers {
  lazy val contributionBuilder = new ContributionSubscriptionBuilder(
    (_: BillingPeriod) =>
      ZuoraContributionConfig("2c92c0f971c65dfe0171c6c1f86e603c", "2c92c0f85a6b1352015a7fcf35ab397c"),
    Some(
      AcquisitionData(
        OphanIds(None, None, None),
        ReferrerAcquisitionData(),
        Set(AbTest("digisubBenefits", "variant")),
      ),
    ),
    new SubscribeItemBuilder(
      UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      User("1234", "hi@gu.com", None, "bob", "smith", Address(None, None, None, None, None, Country.UK)),
      GBP,
    ),
  )

  lazy val contribution =
    contributionBuilder
      .build(
        ContributionState(
          Contribution(50, GBP, Monthly),
          PayPalReferenceTransaction("baid", "hi@gu.com"),
          SalesforceContactRecord("", ""),
        ),
      )

  "SubscriptionData for a contribution in the benefits test" should "be correct" in {
    val saleDate = LocalDate.now(DateTimeZone.UTC)
    contribution.subscriptionData shouldBe SubscriptionData(
      List(
        RatePlanData(
          RatePlan("2c92c0f971c65dfe0171c6c1f86e603c"),
          List(RatePlanChargeData(ContributionRatePlanCharge("2c92c0f85a6b1352015a7fcf35ab397c", 50))),
          List(),
        ),
      ),
      Subscription(
        contractAcceptanceDate = saleDate,
        contractEffectiveDate = saleDate,
        termStartDate = saleDate,
        createdRequestId = "f7651338-5d94-4f57-85fd-262030de9ad5",
        initialTermPeriodType = Month,
        readerType = ReaderType.Direct,
        promoCode = None,
        acquisitionMetadata = Some(AcquisitionMetadata(true)),
      ),
    )
  }

}
