package controllers

import com.gu.i18n.{Country, Currency}
import com.gu.support.acquisitions.{AbTest, OphanIds, ReferrerAcquisitionData}
import com.gu.support.catalog.FulfilmentOptions
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{Address, Annual, BillingPeriod, GuardianWeekly, Monthly, PaymentFields, ProductType}
import org.mockito.Mockito
import org.mockito.Mockito.when
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar.mock
import services.stepfunctions.CreateSupportWorkersRequest
import org.mockito.Mockito.{mock => mockitoMock}
import org.scalatest.prop.TableDrivenPropertyChecks._

class ThreeTierTestSpec extends AnyFlatSpec with Matchers {
  "augmentPromoCode" should "augment promoCode if in test, GuardianWeekly and mismatching promoCode" in {
    val configs = Table(
      ("Currency", "billingPerdiod", "alpha2", "Country", "given promoCode", "expected promoCode"),
      (Currency.EUR, Monthly, "DE", "Germany", Some("3TIER_WEEKLY_UK_ANNUAL"), Some("3TIER_WEEKLY_EU_MONTHLY")),
      (Currency.USD, Annual, "US", "United States", Some("3TIER_WEEKLY_AU_WEEKLY"), Some("3TIER_WEEKLY_US_ANNUAL")),
      (Currency.GBP, Monthly, "EG", "Egypt", Some("3TIER_WEEKLY_NZ_ANNUAL"), Some("3TIER_WEEKLY_INT_MONTHLY")),
    )

    forAll(configs) {
      (
          currency: Currency,
          billingPeriod: BillingPeriod,
          alpha2: String,
          countryName: String,
          givenPromoCode: Option[String],
          expectedPromoCode: Option[String],
      ) =>
        val fulfilmentOptions = mock[FulfilmentOptions]
        val body = CreateSupportWorkersRequest(
          threeTierCreateSupporterPlusSubscription = Some(true),
          product = GuardianWeekly(
            currency = currency,
            billingPeriod = billingPeriod,
            fulfilmentOptions = fulfilmentOptions,
          ),
          billingAddress = Address(
            country = Country(alpha2 = alpha2, name = countryName),
            lineOne = None,
            lineTwo = None,
            city = None,
            state = None,
            postCode = None,
          ),
          promoCode = givenPromoCode,
          title = None,
          firstName = "",
          lastName = "",
          deliveryAddress = None,
          giftRecipient = None,
          firstDeliveryDate = None,
          paymentFields = mock[Either[PaymentFields, RedemptionData]],
          csrUsername = None,
          salesforceCaseId = None,
          ophanIds = mock[OphanIds],
          referrerAcquisitionData = mock[ReferrerAcquisitionData],
          supportAbTests = mock[Set[AbTest]],
          email = "",
          telephoneNumber = None,
          deliveryInstructions = None,
          debugInfo = None,
        )

        ThreeTierTest.augmentPromoCode(body).promoCode shouldBe expectedPromoCode
    }
  }

}
