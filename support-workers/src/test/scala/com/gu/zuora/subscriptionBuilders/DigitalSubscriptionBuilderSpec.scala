package com.gu.zuora.subscriptionBuilders

import java.util.UUID

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.gu.support.config.ZuoraDigitalPackConfig
import com.gu.support.promotions.{PromoError, PromotionService}
import com.gu.support.redemption.GetCodeStatus.InvalidReaderType
import com.gu.support.redemption.{DynamoLookup, GetCodeStatus}
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.{DigitalPack, Monthly, Quarterly}
import com.gu.support.zuora.api.ReaderType.{Corporate, Gift}
import com.gu.support.zuora.api._
import org.joda.time.LocalDate
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar._
import org.scalatest.EitherValues._

import scala.concurrent.Future

//noinspection RedundantDefaultArgument
class DigitalSubscriptionBuilderSpec extends AsyncFlatSpec with Matchers {

  "SubscriptionData for a corporate subscription redemption" should "be correct" in
    corporate.map { subData =>
      subData shouldBe SubscriptionData(
        List(RatePlanData(RatePlan("2c92c0f971c65dfe0171c6c1f86e603c"), List(), List())),
        Subscription(
          contractAcceptanceDate = saleDate,
          contractEffectiveDate = saleDate,
          termStartDate = saleDate,
          createdRequestId__c = "f7651338-5d94-4f57-85fd-262030de9ad5",
          autoRenew = true,
          initialTermPeriodType = Month,
          initialTerm = 12,
          renewalTerm = 12,
          termType = "TERMED",
          readerType = ReaderType.Corporate,
          promoCode = None,
          redemptionCode = Some("CODE"),
          corporateAccountId = Some("1")
        )
      )
    }

  "SubscriptionData for a monthly subscription" should "be correct" in
    monthly.map { subData =>
      subData shouldBe SubscriptionData(
        List(RatePlanData(RatePlan("2c92c0f84bbfec8b014bc655f4852d9d"), List(), List())),
        Subscription(
          contractAcceptanceDate = saleDate.plusDays(16),
          contractEffectiveDate = saleDate,
          termStartDate = saleDate,
          createdRequestId__c = "f7651338-5d94-4f57-85fd-262030de9ad5",
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

  "SubscriptionData for a 3 monthly gift subscription purchase" should "be correct" in
    threeMonthGiftPurchase.map { subData =>
      subData.ratePlanData shouldBe List(RatePlanData(RatePlan("2c92c0f873ad73b60173b534ca586129"), List(), List()))
      import subData.subscription._
      autoRenew shouldBe false
      contractAcceptanceDate shouldBe saleDate
      readerType shouldBe Gift
      redemptionCode.isDefined shouldBe true
      redemptionCode.get.substring(0, 4) shouldBe "gd03"
      initialTerm shouldBe 3 //TODO: RB check that this is correct
      initialTermPeriodType shouldBe Month
      promoCode shouldBe None
      corporateAccountId shouldBe None
    }

  "Attempting to build a subscribe request for a gift redemptions" should "return an error" in
    threeMonthGiftRedemption.map { error =>
      error.right.value shouldBe InvalidReaderType
    }

  lazy val promotionService = mock[PromotionService]
  lazy val saleDate = new LocalDate(2020, 6, 5)

  lazy val corporate = DigitalSubscriptionBuilder.build(
    DigitalPack(GBP, null /* FIXME should be Option-al for a corp sub */ , Corporate),
    UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    SubscriptionRedemption(
      RedemptionData(RedemptionCode("CODE").right.get),
      new GetCodeStatus({
        case "CODE" => Future.successful(Some(Map(
          "available" -> DynamoLookup.DynamoBoolean(true),
          "corporateId" -> DynamoLookup.DynamoString("1")
        )))
      })),
    SANDBOX,
    () => saleDate
  ).value.map(_.right.get)

  lazy val monthly = DigitalSubscriptionBuilder.build(
    DigitalPack(GBP, Monthly),
    UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    SubscriptionPurchase(ZuoraDigitalPackConfig(14, 2), None, Monthly, Country.UK, promotionService),
    SANDBOX,
    () => saleDate
  ).value.map(_.right.get)

  lazy val threeMonthGiftPurchase = DigitalSubscriptionBuilder.build(
    DigitalPack(GBP, Quarterly, Gift),
    UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    SubscriptionPurchase(ZuoraDigitalPackConfig(14, 2), None, Quarterly, Country.UK, promotionService),
    SANDBOX,
    () => saleDate
  ).value.map(_.right.get)

  lazy val threeMonthGiftRedemption: Future[Either[PromoError, GetCodeStatus.RedemptionInvalid]] = DigitalSubscriptionBuilder.build(
    DigitalPack(GBP, Quarterly, Gift),
    UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    SubscriptionRedemption(RedemptionData(RedemptionCode("any-code").right.get),
      new GetCodeStatus({
        case "CODE" => Future.successful(Some(Map(
          "available" -> DynamoLookup.DynamoBoolean(true),
          "corporateId" -> DynamoLookup.DynamoString("1")
        )))
      })),
    SANDBOX,
    () => saleDate
  ).value.map(_.left.get)

}
