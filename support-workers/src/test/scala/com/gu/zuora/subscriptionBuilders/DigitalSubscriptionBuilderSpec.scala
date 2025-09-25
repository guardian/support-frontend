package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.i18n.Country
import com.gu.i18n.CountryGroup.UK
import com.gu.i18n.Currency.GBP
import com.gu.support.acquisitions.{AbTest, AcquisitionData, OphanIds}
import com.gu.support.config.TouchPointEnvironments.CODE
import com.gu.support.config.ZuoraDigitalPackConfig
import com.gu.support.promotions.{Promotion, PromotionService, PromotionWithCode}
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionState
import com.gu.support.zuora.api.AcquisitionSource.CSR
import com.gu.support.zuora.api._
import com.gu.zuora.Fixtures.blankReferrerAcquisitionData
import org.joda.time.LocalDate
import org.mockito.ArgumentMatchers
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar._

import java.util.UUID

//noinspection RedundantDefaultArgument
class DigitalSubscriptionBuilderSpec extends AsyncFlatSpec with Matchers {

  "SubscriptionData for a monthly subscription" should "be correct" in {
    monthly.subscriptionData shouldBe SubscriptionData(
      List(RatePlanData(RatePlan("2c92c0f84bbfec8b014bc655f4852d9d"), List(), List())),
      Subscription(
        contractAcceptanceDate = saleDate.plusDays(16),
        contractEffectiveDate = saleDate,
        termStartDate = saleDate,
        createdRequestId = "f7651338-5d94-4f57-85fd-262030de9ad5",
        autoRenew = true,
        initialTermPeriodType = Month,
        initialTerm = 12,
        renewalTerm = 12,
        termType = "TERMED",
        readerType = ReaderType.Direct,
        promoCode = None,
        lastPlanAddedDate = saleDate,
      ),
    )
  }

  "SubscriptionData" should "have set acquisitionSource csrUsername and salesforceCaseId" in {
    csrSubscription.subscription.acquisitionSource shouldBe Some(CSR)
    csrSubscription.subscription.createdByCsr shouldBe Some("Dan Csr")
    csrSubscription.subscription.acquisitionCase shouldBe Some("test_case_id")
  }

  "SubscriptionData for a Monthly subscription with a non-Patron PromoCode" should "be correct" in {
    val aPromotion = mock[Promotion]
    val pwc = PromotionWithCode("NOTAPATRONPROMO", aPromotion)

    when(promotionService.findPromotion(ArgumentMatchers.eq("NOTAPATRONPROMO"))).thenReturn(Right(pwc))

    when(
      promotionService.applyPromotion(
        ArgumentMatchers.eq(pwc),
        ArgumentMatchers.eq(UK),
        ArgumentMatchers.eq("2c92c0f84bbfec8b014bc655f4852d9d"),
        any(),
        ArgumentMatchers.eq(false),
      ),
    ).thenAnswer { i =>
      {
        val sd = i.getArgument[SubscriptionData](3)
        val patchedSubscription = sd.subscription.copy(promoCode = Some(pwc.promoCode))
        Right(sd.copy(subscription = patchedSubscription))
      }
    }

    monthlyWithPromo.subscriptionData shouldBe SubscriptionData(
      List(RatePlanData(RatePlan("2c92c0f84bbfec8b014bc655f4852d9d"), List(), List())),
      Subscription(
        contractAcceptanceDate = saleDate.plusDays(16),
        contractEffectiveDate = saleDate,
        termStartDate = saleDate,
        createdRequestId = "f7651338-5d94-4f57-85fd-262030de9ad5",
        autoRenew = true,
        initialTermPeriodType = Month,
        initialTerm = 12,
        renewalTerm = 12,
        termType = "TERMED",
        readerType = ReaderType.Direct,
        promoCode = Some("NOTAPATRONPROMO"),
        lastPlanAddedDate = saleDate,
      ),
    )
  }

  lazy val promotionService = mock[PromotionService]
  lazy val saleDate = new LocalDate(2020, 6, 5)

  lazy val subscriptionDirectPurchaseBuilder = new DigitalSubscriptionBuilder(
    ZuoraDigitalPackConfig(14, 2, monthlyChargeId = "monthlyChargeId", annualChargeId = "annualChargeId"),
    promotionService,
    DateGenerator(saleDate),
    CODE,
    new SubscribeItemBuilder(
      UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      User("1234", "hi@thegulocal.com", None, "bob", "smith", Address(None, None, None, None, None, Country.UK)),
      GBP,
      saleDate,
    ),
  )

  lazy val monthly =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionState(
          Country.UK,
          DigitalPack(GBP, Monthly),
          None,
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          None,
          SalesforceContactRecord("", ""),
          similarProductsConsent = None,
        ),
        None,
        None,
      )
      .toOption
      .get

  lazy val csrSubscription = subscriptionDirectPurchaseBuilder
    .build(
      DigitalSubscriptionState(
        Country.UK,
        DigitalPack(GBP, Monthly),
        None,
        PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
        None,
        SalesforceContactRecord("", ""),
        similarProductsConsent = None,
      ),
      Some("Dan Csr"),
      Some("test_case_id"),
    )
    .toOption
    .get
    .subscriptionData

  lazy val monthlyWithPromo =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionState(
          Country.UK,
          DigitalPack(GBP, Monthly),
          None,
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          Some(AppliedPromotion("NOTAPATRONPROMO", UK.id)),
          SalesforceContactRecord("", ""),
          similarProductsConsent = None,
        ),
        None,
        None,
      )
      .toOption
      .get

  lazy val monthlyPatron =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionState(
          Country.UK,
          DigitalPack(GBP, Monthly),
          None,
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          Some(AppliedPromotion("FOOPATRON", UK.id)),
          SalesforceContactRecord("", ""),
          similarProductsConsent = None,
        ),
        None,
        None,
      )
      .toOption
      .get

}
