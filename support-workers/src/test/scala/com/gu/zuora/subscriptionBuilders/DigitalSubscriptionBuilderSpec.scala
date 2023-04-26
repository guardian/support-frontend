package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.i18n.Country
import com.gu.i18n.Country.Australia
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.acquisitions.{AbTest, AcquisitionData, OphanIds}
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.gu.support.config.{TouchPointEnvironments, ZuoraDigitalPackConfig, ZuoraInvoiceTemplatesConfig}
import com.gu.support.promotions.{Promotion, PromotionService, PromotionWithCode}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.GiftRecipient.DigitalSubscriptionGiftRecipient
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{
  DigitalSubscriptionDirectPurchaseState,
  DigitalSubscriptionGiftPurchaseState,
}
import com.gu.support.zuora.api.AcquisitionSource.CSR
import com.gu.support.zuora.api.ReaderType.Gift
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
import scala.concurrent.Future

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
        redemptionCode = None,
      ),
    )
  }

  "SubscriptionData for a 3 monthly gift subscription purchase" should "be correct" in {
    threeMonthGiftPurchase._1.subscriptionData.ratePlanData shouldBe List(
      RatePlanData(RatePlan("2c92c0f8778bf8f60177915b477714aa"), List(), List()),
    )
    import threeMonthGiftPurchase._1.subscriptionData.subscription._
    autoRenew shouldBe false
    contractAcceptanceDate shouldBe saleDate
    readerType shouldBe Gift
    threeMonthGiftPurchase._2.value.substring(0, 4) shouldBe "gd03"
    initialTerm shouldBe GiftCodeValidator.expirationTimeInMonths + 1
    initialTermPeriodType shouldBe Month
    promoCode shouldBe None
    giftNotificationEmailDate shouldBe Some(new LocalDate(2020, 12, 1))
  }

  "SubscriptionData" should "have set acquisitionSource csrUsername and salesforceCaseId" in {
    csrSubscription.subscription.acquisitionSource shouldBe Some(CSR)
    csrSubscription.subscription.createdByCsr shouldBe Some("Dan Csr")
    csrSubscription.subscription.acquisitionCase shouldBe Some("test_case_id")
  }

  "Valid digital subs from the benefits test" should "have charge overrides" in {
    validMonthlyBenefitsTest.subscriptionData.ratePlanData shouldBe List(
      RatePlanData(
        RatePlan("2c92c0f84bbfec8b014bc655f4852d9d"),
        List(RatePlanChargeData(RatePlanChargeOverride("monthlyChargeId", 12))),
        Nil,
      ),
    )
  }

  "Digital subs from the benefits test with amounts which are too low" should "not have charge overrides" in {
    lowAmountMonthlyBenefitsTest.subscriptionData.ratePlanData shouldBe List(
      RatePlanData(
        RatePlan("2c92c0f84bbfec8b014bc655f4852d9d"),
        Nil,
        Nil,
      ),
    )
  }

  "Digital subs which are not in the benefits test" should "not have charge overrides even if an amount is present" in {
    monthlyNotInBenefitsTest.subscriptionData.ratePlanData shouldBe List(
      RatePlanData(
        RatePlan("2c92c0f84bbfec8b014bc655f4852d9d"),
        Nil,
        Nil,
      ),
    )
  }

  "SubscriptionData for a Monthly subscription with a non-Patron PromoCode" should "be correct" in {
    val aPromotion = mock[Promotion]
    val pwc = PromotionWithCode("NOTAPATRONPROMO", aPromotion)

    when(promotionService.findPromotion(ArgumentMatchers.eq("NOTAPATRONPROMO"))).thenReturn(Right(pwc))

    when(
      promotionService.applyPromotion(
        ArgumentMatchers.eq(pwc),
        ArgumentMatchers.eq(Country.UK),
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
        redemptionCode = None,
      ),
    )
  }

  "SubscriptionData for a Monthly subscription with a Patron PromoCode" should "be correct" in {
    val aPromotion = mock[Promotion]
    val pwc = PromotionWithCode("FOOPATRON", aPromotion)

    when(promotionService.findPromotion(ArgumentMatchers.eq("FOOPATRON"))).thenReturn(Right(pwc))

    when(
      promotionService.applyPromotion(
        ArgumentMatchers.eq(pwc),
        ArgumentMatchers.eq(Country.UK),
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

    monthlyPatron.subscriptionData shouldBe SubscriptionData(
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
        readerType = ReaderType.Patron,
        promoCode = Some("FOOPATRON"),
        redemptionCode = None,
      ),
    )
  }

  lazy val promotionService = mock[PromotionService]
  lazy val saleDate = new LocalDate(2020, 6, 5)
  lazy val giftCodeGeneratorService = new GiftCodeGeneratorService
  lazy val invoiceTemplateIds = ZuoraInvoiceTemplatesConfig(
    auTemplateId = "auInvoiceTemplateId",
    defaultTemplateId = "defaultInvoiceTemplateId",
  )

  lazy val subscriptionDirectPurchaseBuilder = new DigitalSubscriptionDirectPurchaseBuilder(
    ZuoraDigitalPackConfig(14, 2, monthlyChargeId = "monthlyChargeId", annualChargeId = "annualChargeId"),
    promotionService,
    DateGenerator(saleDate),
    SANDBOX,
    new SubscribeItemBuilder(
      UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      User("1234", "hi@thegulocal.com", None, "bob", "smith", Address(None, None, None, None, None, Country.UK)),
      GBP,
      invoiceTemplateIds,
    ),
  )

  lazy val subscriptionGiftPurchaseBuilder = new DigitalSubscriptionGiftPurchaseBuilder(
    promotionService,
    DateGenerator(saleDate),
    new GiftCodeGeneratorService,
    SANDBOX,
    new SubscribeItemBuilder(
      UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      User("1234", "hi@thegulocal.com", None, "bob", "smith", Address(None, None, None, None, None, Country.UK)),
      GBP,
      invoiceTemplateIds,
    ),
  )

  lazy val monthly =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionDirectPurchaseState(
          Country.UK,
          DigitalPack(GBP, Monthly),
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          None,
          SalesforceContactRecord("", ""),
        ),
        None,
        None,
        None,
      )
      .toOption
      .get

  lazy val validMonthlyBenefitsTest =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionDirectPurchaseState(
          Country.UK,
          DigitalPack(GBP, Monthly, amount = Some(12)),
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          None,
          SalesforceContactRecord("", ""),
        ),
        None,
        None,
        Some(
          AcquisitionData(OphanIds(None, None, None), blankReferrerAcquisitionData, Set(AbTest("PP_V3", "V2_BULLET"))),
        ),
      )
      .toOption
      .get

  lazy val lowAmountMonthlyBenefitsTest =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionDirectPurchaseState(
          Country.UK,
          DigitalPack(GBP, Monthly, amount = Some(1)),
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          None,
          SalesforceContactRecord("", ""),
        ),
        None,
        None,
        Some(
          AcquisitionData(OphanIds(None, None, None), blankReferrerAcquisitionData, Set(AbTest("PP_V3", "V2_BULLET"))),
        ),
      )
      .toOption
      .get

  lazy val monthlyNotInBenefitsTest =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionDirectPurchaseState(
          Country.UK,
          DigitalPack(GBP, Monthly, amount = Some(12)),
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          None,
          SalesforceContactRecord("", ""),
        ),
        None,
        None,
        None,
      )
      .toOption
      .get

  lazy val threeMonthGiftPurchase =
    subscriptionGiftPurchaseBuilder
      .build(
        DigitalSubscriptionGiftPurchaseState(
          Country.UK,
          DigitalSubscriptionGiftRecipient("bob", "smith", "hi@thegulocal.com", None, new LocalDate(2020, 12, 1)),
          DigitalPack(GBP, Quarterly, Gift),
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          None,
          SalesforceContactRecords(SalesforceContactRecord("", ""), Some(SalesforceContactRecord("", ""))),
        ),
        None,
        None,
      )
      .toOption
      .get

  lazy val csrSubscription = subscriptionDirectPurchaseBuilder
    .build(
      DigitalSubscriptionDirectPurchaseState(
        Country.UK,
        DigitalPack(GBP, Monthly),
        PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
        None,
        SalesforceContactRecord("", ""),
      ),
      Some("Dan Csr"),
      Some("test_case_id"),
      None,
    )
    .toOption
    .get
    .subscriptionData

  lazy val monthlyWithPromo =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionDirectPurchaseState(
          Country.UK,
          DigitalPack(GBP, Monthly),
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          Some("NOTAPATRONPROMO"),
          SalesforceContactRecord("", ""),
        ),
        None,
        None,
        None,
      )
      .toOption
      .get

  lazy val monthlyPatron =
    subscriptionDirectPurchaseBuilder
      .build(
        DigitalSubscriptionDirectPurchaseState(
          Country.UK,
          DigitalPack(GBP, Monthly),
          PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
          Some("FOOPATRON"),
          SalesforceContactRecord("", ""),
        ),
        None,
        None,
        None,
      )
      .toOption
      .get

}
