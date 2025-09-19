package com.gu.support.workers.createZuoraSubscription

import com.gu.helpers.DateGenerator
import com.gu.i18n.CountryGroup.UK
import com.gu.i18n.{Country, Currency}
import com.gu.support.catalog.{CatalogServiceSpec, ProductRatePlanId}
import com.gu.support.config.{TouchPointEnvironments, V2, ZuoraSupporterPlusConfig}
import com.gu.support.workers.integration.TestData.supporterPlusPromotionService
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.SupporterPlusState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailSupporterPlusState
import com.gu.support.workers._
import com.gu.support.zuora.api.response._
import com.gu.support.zuora.api.{PreviewSubscribeRequest, ReaderType, SubscribeRequest}
import com.gu.support.zuora.{api, domain}
import com.gu.zuora.productHandlers.ZuoraSupporterPlusHandler
import com.gu.zuora.subscriptionBuilders.{SubscribeItemBuilder, SupporterPlusSubcriptionBuilder}
import com.gu.zuora.{ZuoraSubscribeService, ZuoraSubscriptionCreator}
import org.joda.time.{DateTime, LocalDate, Months}
import org.scalatest.Inside.inside
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.util.UUID
import scala.concurrent.Future

class CreateZuoraSubscriptionSupporterPlusStepsSpec extends AsyncFlatSpec with Matchers {

  val expectedRatePlanToCharges: Map[ProductRatePlanId, List[api.RatePlanCharge]] =
    Map[ProductRatePlanId, List[api.RatePlanCharge]](
      "" -> List(api.DiscountRatePlanCharge("", 80.0, Some(Months.months(3)))),
      "8a128ed885fc6ded018602296ace3eb8" -> List(api.RatePlanChargeOverride("monConChId", 10)),
      // the standard s+ charge is not overridden so it doesn't appear here
    )

  it should "create a supporter plus subscription with promo" in {

    val state = SupporterPlusState(
      billingCountry = Country.UK,
      product = SupporterPlus(22, Currency.GBP, Monthly),
      productInformation = Some(ProductInformation("SupporterPlus", "Monthly", Some(22), None, None, None, None)),
      paymentMethod = PayPalReferenceTransaction("baid", "me@somewhere.com"),
      appliedPromotion = Some(AppliedPromotion("SUPPORTER_PLUS_PROMO", UK.id)),
      salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
      similarProductsConsent = None,
    )

    val zuora = new ZuoraSubscribeService {
      // not testing retries - these two are empty lists
      override def getAccountFields(identityId: IdentityId, now: DateTime): Future[List[domain.DomainAccount]] =
        Future(List())
      override def getSubscriptions(accountNumber: ZuoraAccountNumber): Future[List[domain.DomainSubscription]] =
        Future(List())
      override def previewSubscribe(
          previewSubscribeRequest: PreviewSubscribeRequest,
      ): Future[List[PreviewSubscribeResponse]] = Future(
        List(
          PreviewSubscribeResponse(
            List(
              InvoiceDataItem(
                List(
                  Charge(
                    serviceStartDate = new LocalDate(2024, 1, 8),
                    serviceEndDate = new LocalDate(2024, 2, 8),
                    taxAmount = 1,
                    chargeAmount = 2,
                  ),
                ),
              ),
              InvoiceDataItem(
                List(
                  Charge(
                    serviceStartDate = new LocalDate(2024, 2, 8),
                    serviceEndDate = new LocalDate(2024, 3, 8),
                    taxAmount = 1,
                    chargeAmount = 2,
                  ),
                ),
              ),
              InvoiceDataItem(
                List(
                  Charge(
                    serviceStartDate = new LocalDate(2024, 3, 8),
                    serviceEndDate = new LocalDate(2024, 4, 8),
                    taxAmount = 10,
                    chargeAmount = 20,
                  ),
                ),
              ),
            ),
            success = true,
          ),
        ),
      )

      // ideally should also check we called zuora with the right post data
      override def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] = {
        val promoCode = subscribeRequest.subscribes.head.subscriptionData.subscription.promoCode
        val paymentType = subscribeRequest.subscribes.head.paymentMethod.get.Type
        val autoPay = subscribeRequest.subscribes.head.account.autoPay
        val readerType = subscribeRequest.subscribes.head.subscriptionData.subscription.readerType
        val ratePlanToCharges: Map[ProductRatePlanId, List[api.RatePlanCharge]] =
          subscribeRequest.subscribes.head.subscriptionData.ratePlanData.map { ratePlanData =>
            val productRatePlanId = ratePlanData.ratePlan.productRatePlanId
            val charges = ratePlanData.ratePlanChargeData.map(_.ratePlanCharge)
            productRatePlanId -> charges
          }.toMap
        val actual = (promoCode, paymentType, autoPay, readerType, ratePlanToCharges)
        actual match {
          case (Some("SUPPORTER_PLUS_PROMO"), "PayPal", true, ReaderType.Direct, ratePlanToCharges)
              if ratePlanToCharges == expectedRatePlanToCharges =>
            Future.successful(
              List(SubscribeResponseAccount("accountdigi", "subdigi", 135.67f, "ididdigi", 246.67f, "aciddigi", true)),
            )
          case _ => Future.failed(new Throwable(s"unexpected subscribe request: $actual"))
        }
      }
    }

    val date = new LocalDate(2020, 6, 15)
    val subscriptionCreator = new ZuoraSupporterPlusHandler(
      new ZuoraSubscriptionCreator(
        zuora,
        DateGenerator(new DateTime(2020, 6, 15, 16, 28, 57)),
        requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
        userId = "111222",
      ),
      new SupporterPlusSubcriptionBuilder(
        config = ZuoraSupporterPlusConfig("monChId", "anChId", V2("monConChId", "anConChId")), // FIXME
        promotionService = supporterPlusPromotionService,
        CatalogServiceSpec.serviceWithFixtures,
        DateGenerator(date),
        TouchPointEnvironments.PROD,
        new SubscribeItemBuilder(
          requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
          user = User(
            "111222",
            "email@blah.com",
            None,
            "bertha",
            "smith",
            Address(None, None, None, None, None, Country.UK),
          ),
          Currency.GBP,
          date,
        ),
      ),
      user =
        User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    )

    val result = subscriptionCreator.subscribe(state, None, None)

    result.map { sendThankYouEmailState =>
      withClue(sendThankYouEmailState) {
        inside(sendThankYouEmailState) { case s: SendThankYouEmailSupporterPlusState =>
          s.accountNumber should be("accountdigi")
          s.subscriptionNumber should be("subdigi")
          s.promoCode should be(Some("SUPPORTER_PLUS_PROMO"))
          s.paymentSchedule should be(
            PaymentSchedule(
              List(
                Payment(new LocalDate(2024, 1, 8), 3),
                Payment(new LocalDate(2024, 2, 8), 3),
                Payment(new LocalDate(2024, 3, 8), 30),
              ),
            ),
          )
        }
      }
    }
  }

}
