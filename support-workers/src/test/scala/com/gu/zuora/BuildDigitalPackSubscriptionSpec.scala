package com.gu.zuora

import java.util.UUID

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.Corporate
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.gu.support.config.ZuoraDigitalPackConfig
import com.gu.support.promotions.PromotionService
import com.gu.support.redemption.{DynamoLookup, GetCodeStatus}
import com.gu.support.redemptions.CorporateRedemption
import com.gu.support.workers.{DigitalPack, Monthly}
import com.gu.support.zuora.api._
import com.gu.zuora.ProductSubscriptionBuilders._
import com.gu.zuora.ProductSubscriptionBuilders.buildDigitalPackSubscription.{SubscriptionPaymentCorporate, SubscriptionPaymentDirect}
import org.joda.time.LocalDate
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar._

import scala.concurrent.Future

class BuildDigitalPackSubscriptionSpec extends AsyncFlatSpec with Matchers {

  "SubscriptionData for a corporate subscription" should "be correct" in
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

  lazy val promotionService = mock[PromotionService]
  lazy val saleDate = new LocalDate(2020, 6, 5)

  lazy val corporate = buildDigitalPackSubscription(
    DigitalPack(GBP, null /* FIXME should be Option-al for a corp sub */ , Corporate),
    UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    SubscriptionPaymentCorporate(
      CorporateRedemption("CODE", "1"),
      new GetCodeStatus({
        case "CODE" => Future.successful(Some(Map(
          "available" -> DynamoLookup.DynamoBoolean(true),
          "corporateId" -> DynamoLookup.DynamoString("1")
        )))
      })),
    SANDBOX,
    () => saleDate
  ).value.map(_.right.get)

  lazy val monthly = buildDigitalPackSubscription(
    DigitalPack(GBP, Monthly),
    UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
    SubscriptionPaymentDirect(ZuoraDigitalPackConfig(14, 2), None, Country.UK, promotionService),
    SANDBOX,
    () => saleDate
  ).value.map(_.right.get)

}
