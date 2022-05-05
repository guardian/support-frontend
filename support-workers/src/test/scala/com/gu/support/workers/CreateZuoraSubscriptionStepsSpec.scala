package com.gu.support.workers

import com.gu.helpers
import com.gu.helpers.DateGenerator
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.support.config.{TouchPointEnvironments, ZuoraDigitalPackConfig}
import com.gu.support.redemption.corporate.DynamoLookup.{DynamoBoolean, DynamoString}
import com.gu.support.redemption.corporate.DynamoUpdate.DynamoFieldUpdate
import com.gu.support.redemption.corporate.{
  CorporateCodeStatusUpdater,
  CorporateCodeValidator,
  DynamoLookup,
  DynamoUpdate,
}
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{
  DigitalSubscriptionCorporateRedemptionState,
  DigitalSubscriptionDirectPurchaseState,
}
import com.gu.support.workers.states.SendThankYouEmailState.{
  SendThankYouEmailDigitalSubscriptionCorporateRedemptionState,
  SendThankYouEmailDigitalSubscriptionDirectPurchaseState,
}
import com.gu.support.zuora.api.ReaderType.Corporate
import com.gu.support.zuora.api.response._
import com.gu.support.zuora.api.{PreviewSubscribeRequest, ReaderType, SubscribeRequest}
import com.gu.support.zuora.domain
import com.gu.zuora.productHandlers.{
  ZuoraDigitalSubscriptionCorporateRedemptionHandler,
  ZuoraDigitalSubscriptionDirectHandler,
}
import com.gu.zuora.subscriptionBuilders.{
  DigitalSubscriptionCorporateRedemptionBuilder,
  DigitalSubscriptionDirectPurchaseBuilder,
  SubscribeItemBuilder,
}
import com.gu.zuora.{ZuoraSubscribeService, ZuoraSubscriptionCreator}
import org.joda.time.{DateTime, LocalDate}
import org.scalatest.Inside.inside
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.util.UUID
import scala.concurrent.Future

class CreateZuoraSubscriptionStepsSpec extends AsyncFlatSpec with Matchers {

  it should "create a Digital Pack corporate subscription" in {

    val testCode = "test-code-123"

    val state = DigitalSubscriptionCorporateRedemptionState(
      product = DigitalPack(Currency.GBP, null /* !*/, Corporate),
      redemptionData = RedemptionData(RedemptionCode(testCode).toOption.get),
      salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
    )

    var dynamoUpdates: List[(String, DynamoUpdate.DynamoFieldUpdate)] = Nil
    val dynamoDb = new DynamoLookup with DynamoUpdate {
      override def lookup(key: String): Future[Option[Map[String, DynamoLookup.DynamoValue]]] = key match {
        case `testCode` =>
          Future.successful(Some(Map("available" -> DynamoBoolean(true), "corporateId" -> DynamoString("1"))))
      }
      override def update(key: String, dynamoFieldUpdate: DynamoUpdate.DynamoFieldUpdate): Future[Unit] = {
        dynamoUpdates = (key, dynamoFieldUpdate) :: dynamoUpdates
        Future.successful(())
      }
    }

    val zuora = new ZuoraSubscribeService {
      override def getAccountFields(identityId: IdentityId, now: DateTime): Future[List[domain.DomainAccount]] =
        Future(List())
      override def getSubscriptions(accountNumber: ZuoraAccountNumber): Future[List[domain.DomainSubscription]] =
        Future(List())
      // should not do a preview against zuora for corp/free subs
      override def previewSubscribe(
          previewSubscribeRequest: PreviewSubscribeRequest,
      ): Future[List[PreviewSubscribeResponse]] = ???
      override def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] = {
        val maybeRedemptionCode = subscribeRequest.subscribes.head.subscriptionData.subscription.redemptionCode
        val paymentType = subscribeRequest.subscribes.head.paymentMethod.isDefined
        val autoPay = subscribeRequest.subscribes.head.account.autoPay
        val readerType = subscribeRequest.subscribes.head.subscriptionData.subscription.readerType
        val ratePlan = subscribeRequest.subscribes.head.subscriptionData.ratePlanData.head.ratePlan.productRatePlanId
        val actual = (maybeRedemptionCode, paymentType, autoPay, readerType, ratePlan)
        actual match {
          case (Some(`testCode`), false, false, ReaderType.Corporate, "2c92c0f971c65dfe0171c6c1f86e603c") =>
            Future.successful(
              List(SubscribeResponseAccount("accountcorp", "subcorp", 135.67f, "ididcorp", 246.67f, "acidcorp", true)),
            )
          case _ => Future.failed(new Throwable(s"subscribe request: $actual"))
        }
      }
    }

    val subscriptionCreator = new ZuoraDigitalSubscriptionCorporateRedemptionHandler(
      new ZuoraSubscriptionCreator(
        zuora,
        DateGenerator(new DateTime(2020, 6, 15, 16, 28, 57)),
        requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
        userId = "111222",
      ),
      new CorporateCodeStatusUpdater(dynamoDb),
      new DigitalSubscriptionCorporateRedemptionBuilder(
        new CorporateCodeValidator(dynamoDb),
        DateGenerator(new LocalDate(2020, 6, 15)),
        TouchPointEnvironments.SANDBOX,
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
          GBP,
        ),
      ),
      user =
        User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    )

    val result = subscriptionCreator.subscribe(state)

    result.map { sendThankYouEmailState =>
      withClue(sendThankYouEmailState) {
        dynamoUpdates should be(List(testCode -> DynamoFieldUpdate("available", false)))
        inside(sendThankYouEmailState) { case s: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState =>
          s.subscriptionNumber should be("subcorp")
        }
      }
    }
  }

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
        TouchPointEnvironments.SANDBOX,
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
