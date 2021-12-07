package com.gu.zuora.subscriptionBuilders

import com.gu.helpers
import com.gu.helpers.DateGenerator
import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.gu.support.config.{TouchPointEnvironments, ZuoraDigitalPackConfig}
import com.gu.support.promotions.PromotionService
import com.gu.support.redemption.corporate.{CorporateCodeValidator, DynamoLookup}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.GiftRecipient.DigitalSubscriptionGiftRecipient
import com.gu.support.workers._
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{DigitalSubscriptionCorporateRedemptionState, DigitalSubscriptionDirectPurchaseState, DigitalSubscriptionGiftPurchaseState}
import com.gu.support.zuora.api.ReaderType.{Corporate, Gift}
import com.gu.support.zuora.api._
import org.joda.time.LocalDate
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar._

import java.util.UUID
import scala.concurrent.Future

//noinspection RedundantDefaultArgument
class DigitalSubscriptionBuilderSpec extends AsyncFlatSpec with Matchers {

  "SubscriptionData for a corporate subscription redemption" should "be correct" in
    corporate.map { subData =>
      subData.subscriptionData shouldBe SubscriptionData(
        List(RatePlanData(RatePlan("2c92c0f971c65dfe0171c6c1f86e603c"), List(), List())),
        Subscription(
          contractAcceptanceDate = saleDate,
          contractEffectiveDate = saleDate,
          termStartDate = saleDate,
          createdRequestId = "f7651338-5d94-4f57-85fd-262030de9ad5",
          autoRenew = true,
          initialTermPeriodType = Month,
          initialTerm = 12,
          renewalTerm = 12,
          termType = "TERMED",
          readerType = ReaderType.Corporate,
          promoCode = None,
          redemptionCode = Some(testCode),
          corporateAccountId = Some("1")
        )
      )
    }

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
        corporateAccountId = None
      )
    )
  }

  "SubscriptionData for a 3 monthly gift subscription purchase" should "be correct" in {
    threeMonthGiftPurchase._1.subscriptionData.ratePlanData shouldBe List(RatePlanData(RatePlan("2c92c0f8778bf8f60177915b477714aa"), List(), List()))
    import threeMonthGiftPurchase._1.subscriptionData.subscription._
    autoRenew shouldBe false
    contractAcceptanceDate shouldBe saleDate
    readerType shouldBe Gift
    threeMonthGiftPurchase._2.value.substring(0, 4) shouldBe "gd03"
    initialTerm shouldBe GiftCodeValidator.expirationTimeInMonths + 1
    initialTermPeriodType shouldBe Month
    promoCode shouldBe None
    corporateAccountId shouldBe None
    giftNotificationEmailDate shouldBe Some(new LocalDate(2020, 12, 1))
  }

  lazy val promotionService = mock[PromotionService]
  lazy val saleDate = new LocalDate(2020, 6, 5)
  lazy val giftCodeGeneratorService = new GiftCodeGeneratorService

  val testCode = "test-code-123"

  lazy val corporateRedemptionBuilder = new DigitalSubscriptionCorporateRedemptionBuilder(
    new CorporateCodeValidator({
      case `testCode` => Future.successful(Some(Map(
        "available" -> DynamoLookup.DynamoBoolean(true),
        "corporateId" -> DynamoLookup.DynamoString("1")
      )))
    }),
    DateGenerator(saleDate),
    TouchPointEnvironments.SANDBOX,
    new SubscribeItemBuilder(
      UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      User("1234", "hi@gu.com", None, "bob", "smith", Address(None, None, None, None, None, Country.UK)),
      GBP,
    )
  )

  lazy val corporate =
    corporateRedemptionBuilder.build(
      DigitalSubscriptionCorporateRedemptionState(
        DigitalPack(GBP, null /* FIXME should be Option-al for a corp sub */ , Corporate), // scalastyle:ignore null
        RedemptionData(RedemptionCode(testCode).toOption.get),
        SalesforceContactRecord("", ""),
      )
    ).value.map(_.toOption.get)

  lazy val subscriptionDirectPurchaseBuilder = new DigitalSubscriptionDirectPurchaseBuilder(
    ZuoraDigitalPackConfig(14, 2),
    promotionService,
    DateGenerator(saleDate),
    SANDBOX,
    new SubscribeItemBuilder(
      UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      User("1234", "hi@gu.com", None, "bob", "smith", Address(None, None, None, None, None, Country.UK)),
      GBP,
    )
  )

  lazy val subscriptionGiftPurchaseBuilder = new DigitalSubscriptionGiftPurchaseBuilder(
    promotionService,
    DateGenerator(saleDate),
    new GiftCodeGeneratorService,
    SANDBOX,
    new SubscribeItemBuilder(
      UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      User("1234", "hi@gu.com", None, "bob", "smith", Address(None, None, None, None, None, Country.UK)),
      GBP,
    )
  )

  lazy val monthly =
    subscriptionDirectPurchaseBuilder.build(
      DigitalSubscriptionDirectPurchaseState(
        Country.UK,
        DigitalPack(GBP, Monthly),
        PayPalReferenceTransaction("baid", "hi@gu.com"),
        None,
        SalesforceContactRecord("", ""),
      ), None, None
    ).toOption.get

  lazy val threeMonthGiftPurchase =
    subscriptionGiftPurchaseBuilder.build(
      DigitalSubscriptionGiftPurchaseState(
        Country.UK,
        DigitalSubscriptionGiftRecipient("bob", "smith", "hi@gu.com", None, new LocalDate(2020, 12, 1)),
        DigitalPack(GBP, Quarterly, Gift),
        PayPalReferenceTransaction("baid", "hi@gu.com"),
        None,
        SalesforceContactRecords(SalesforceContactRecord("", ""), Some(SalesforceContactRecord("", "")))
      ), None, None
    ).toOption.get

}
