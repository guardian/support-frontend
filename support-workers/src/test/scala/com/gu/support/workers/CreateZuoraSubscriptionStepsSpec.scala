package com.gu.support.workers

import com.gu.helpers
import com.gu.helpers.DateGenerator
import com.gu.i18n.Country.Australia
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.support.config.{TouchPointEnvironments, ZuoraDigitalPackConfig, ZuoraInvoiceTemplatesConfig}

import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionDirectPurchaseState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailDigitalSubscriptionDirectPurchaseState
import com.gu.support.zuora.api.response._
import com.gu.support.zuora.api.{PreviewSubscribeRequest, ReaderType, SubscribeRequest}
import com.gu.support.zuora.domain
import com.gu.zuora.productHandlers.ZuoraDigitalSubscriptionDirectHandler
import com.gu.zuora.subscriptionBuilders.{DigitalSubscriptionDirectPurchaseBuilder, SubscribeItemBuilder}
import com.gu.zuora.{ZuoraSubscribeService, ZuoraSubscriptionCreator}
import org.joda.time.{DateTime, LocalDate}
import org.scalatest.Inside.inside
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.util.UUID
import scala.concurrent.Future

class CreateZuoraSubscriptionStepsSpec extends AsyncFlatSpec with Matchers {

  val invoiceTemplateIds = ZuoraInvoiceTemplatesConfig(
    auTemplateId = "auInvoiceTemplateId",
    defaultTemplateId = "defaultInvoiceTemplateId",
  )

  it should "create a Digital Pack standard (paid) subscription" in {

    val state = DigitalSubscriptionDirectPurchaseState(
      billingCountry = Country.UK,
      product = DigitalPack(Currency.GBP, Monthly),
      paymentMethod = PayPalReferenceTransaction("baid", "me@somewhere.com"),
      promoCode = None,
      salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
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
            List(InvoiceDataItem(List(Charge(new LocalDate(2020, 6, 15), new LocalDate(2020, 6, 15), 1.24, 4.56)))),
            true,
          ),
        ),
      )
      // ideally should also check we called zuora with the right post data
      override def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] = {
        val maybeRedemptionCode = subscribeRequest.subscribes.head.subscriptionData.subscription.redemptionCode
        val paymentType = subscribeRequest.subscribes.head.paymentMethod.get.Type
        val autoPay = subscribeRequest.subscribes.head.account.autoPay
        val readerType = subscribeRequest.subscribes.head.subscriptionData.subscription.readerType
        val ratePlan = subscribeRequest.subscribes.head.subscriptionData.ratePlanData.head.ratePlan.productRatePlanId
        val actual = (maybeRedemptionCode, paymentType, autoPay, readerType, ratePlan)
        actual match {
          case (None, "PayPal", true, ReaderType.Direct, "2c92c0f84bbfec8b014bc655f4852d9d") =>
            Future.successful(
              List(SubscribeResponseAccount("accountdigi", "subdigi", 135.67f, "ididdigi", 246.67f, "aciddigi", true)),
            )
          case _ => Future.failed(new Throwable(s"subscribe request: $actual"))
        }
      }
    }

    val subscriptionCreator = new ZuoraDigitalSubscriptionDirectHandler(
      new ZuoraSubscriptionCreator(
        zuora,
        DateGenerator(new DateTime(2020, 6, 15, 16, 28, 57)),
        requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
        userId = "111222",
      ),
      new DigitalSubscriptionDirectPurchaseBuilder(
        config = ZuoraDigitalPackConfig(14, 2, "", ""),
        promotionService = null, // shouldn't be called for subs with no promo code
        DateGenerator(new LocalDate(2020, 6, 15)),
        TouchPointEnvironments.CODE,
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
          invoiceTemplateIds,
        ),
      ),
      user =
        User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    )

    val result = subscriptionCreator.subscribe(state, None, None, None)

    result.map { sendThankYouEmailState =>
      withClue(sendThankYouEmailState) {
        inside(sendThankYouEmailState) { case s: SendThankYouEmailDigitalSubscriptionDirectPurchaseState =>
          s.accountNumber should be("accountdigi")
          s.subscriptionNumber should be("subdigi")
        }
      }
    }
  }

}
