package com.gu.support.workers

import java.util.UUID

import com.gu.i18n.{Country, Currency}
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.catalog.Corporate
import com.gu.support.config.{ZuoraConfig, ZuoraDigitalPackConfig}
import com.gu.support.redemption.DynamoLookup.{DynamoBoolean, DynamoString}
import com.gu.support.redemption.DynamoUpdate.DynamoFieldUpdate
import com.gu.support.redemption.{DynamoLookup, DynamoUpdate}
import com.gu.support.redemptions.{CorporateRedemption, RedemptionCode}
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.zuora.api.response._
import com.gu.support.zuora.api.{PreviewSubscribeRequest, ReaderType, SubscribeRequest}
import com.gu.support.zuora.domain
import com.gu.zuora.ZuoraSubscribeService
import org.joda.time.{DateTime, LocalDate}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

class CreateZuoraSubscriptionStepsSpec extends AsyncFlatSpec with Matchers {

  it should "create a Digital Pack corporate subscription" in {

    val state = CreateZuoraSubscriptionState(
      requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
      giftRecipient = None,
      product = DigitalPack(Currency.GBP, null /* !*/, Corporate),
      RedemptionNoProvider,
      paymentMethod = Right(CorporateRedemption(RedemptionCode("TESTCODE").right.get)),
      firstDeliveryDate = None,
      promoCode = None,
      salesforceContacts = SalesforceContactRecords(
        buyer = SalesforceContactRecord("sfbuy", "sfbuyacid"),
        giftRecipient = None
      ),
      acquisitionData = None
    )


    var dynamoUpdates: List[(String, DynamoUpdate.DynamoFieldUpdate)] = Nil
    val dyanmoDb = new DynamoLookup with DynamoUpdate {
      override def lookup(key: String): Future[Option[Map[String, DynamoLookup.DynamoValue]]] = key match {
        case "TESTCODE" => Future.successful(Some(Map("available" -> DynamoBoolean(true), "corporateId" -> DynamoString("1"))))
      }
      override def update(key: String, dynamoFieldUpdate: DynamoUpdate.DynamoFieldUpdate): Future[Unit] = {
        dynamoUpdates = (key, dynamoFieldUpdate) :: dynamoUpdates
        Future.successful(())
      }
    }

    val zuora = new ZuoraSubscribeService {
      override def getAccountFields(identityId: IdentityId, now: DateTime): Future[List[domain.DomainAccount]] = Future(List())
      override def getSubscriptions(accountNumber: ZuoraAccountNumber): Future[List[domain.DomainSubscription]] = Future(List())
      // should not do a preview against zuora for corp/free subs
      override def previewSubscribe(previewSubscribeRequest: PreviewSubscribeRequest): Future[List[PreviewSubscribeResponse]] = ???
      override def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] = {
        val maybeRedemptionCode = subscribeRequest.subscribes.head.subscriptionData.subscription.redemptionCode
        val paymentType = subscribeRequest.subscribes.head.paymentMethod.isDefined
        val autoPay = subscribeRequest.subscribes.head.account.autoPay
        val readerType = subscribeRequest.subscribes.head.subscriptionData.subscription.readerType
        val ratePlan = subscribeRequest.subscribes.head.subscriptionData.ratePlanData.head.ratePlan.productRatePlanId
        val actual = (maybeRedemptionCode, paymentType, autoPay, readerType, ratePlan)
        actual match {
          case (Some("TESTCODE"), false, false, ReaderType.Corporate, "2c92c0f971c65dfe0171c6c1f86e603c") =>
            Future.successful(List(SubscribeResponseAccount("accountcorp", "subcorp", 135.67f, "ididcorp", 246.67f, "acidcorp", true)))
          case _ => Future.failed(new Throwable(s"subscribe request: $actual"))
        }
      }
    }

    val result = CreateZuoraSubscription(
      state,
      RequestInfo(false, false, Nil, false),
      () => new DateTime(2020, 6, 15, 16, 28, 57),
      () => new LocalDate(2020, 6, 15),
      null,
      dyanmoDb,
      zuora,
      ZuoraConfig(null, null, null, null, null, null)
    )

    result.map { handlerResult =>
      withClue(handlerResult) {
        dynamoUpdates should be(List("TESTCODE" -> DynamoFieldUpdate("available", false)))
        handlerResult.value.accountNumber should be("accountcorp")
        handlerResult.value.subscriptionNumber should be("subcorp")
        handlerResult.value.paymentMethod.isRight should be(true) // it's still a corp sub!
      }
    }
  }

  it should "create a Digital Pack standard (paid) subscription" in {

    val state = CreateZuoraSubscriptionState(
      requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5"),
      user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
      giftRecipient = None,
      product = DigitalPack(Currency.GBP, Monthly),
      PayPal,
      paymentMethod = Left(PayPalReferenceTransaction("baid", "me@somewhere.com")),
      firstDeliveryDate = None,
      promoCode = None,
      salesforceContacts = SalesforceContactRecords(
        buyer = SalesforceContactRecord("sfbuy", "sfbuyacid"),
        giftRecipient = None
      ),
      acquisitionData = None
    )

    val zuora = new ZuoraSubscribeService {
      // not testing retries - these two are empty lists
      override def getAccountFields(identityId: IdentityId, now: DateTime): Future[List[domain.DomainAccount]] = Future(List())
      override def getSubscriptions(accountNumber: ZuoraAccountNumber): Future[List[domain.DomainSubscription]] = Future(List())
      override def previewSubscribe(previewSubscribeRequest: PreviewSubscribeRequest): Future[List[PreviewSubscribeResponse]] = Future(List(
        PreviewSubscribeResponse(
          List(InvoiceDataItem(List(Charge(new LocalDate(2020, 6, 15), new LocalDate(2020, 6, 15), 1.24, 4.56)))),
          true
        )
      ))
      // ideally should also check we called zuora with the right post data
      override def subscribe(subscribeRequest: SubscribeRequest): Future[List[SubscribeResponseAccount]] = {
        val maybeRedemptionCode = subscribeRequest.subscribes.head.subscriptionData.subscription.redemptionCode
        val paymentType = subscribeRequest.subscribes.head.paymentMethod.get.`type`
        val autoPay = subscribeRequest.subscribes.head.account.autoPay
        val readerType = subscribeRequest.subscribes.head.subscriptionData.subscription.readerType
        val ratePlan = subscribeRequest.subscribes.head.subscriptionData.ratePlanData.head.ratePlan.productRatePlanId
        val actual = (maybeRedemptionCode, paymentType, autoPay, readerType, ratePlan)
        actual match {
          case (None, "PayPal", true, ReaderType.Direct, "2c92c0f84bbfec8b014bc655f4852d9d") =>
            Future.successful(List(SubscribeResponseAccount("accountdigi", "subdigi", 135.67f, "ididdigi", 246.67f, "aciddigi", true)))
          case _ => Future.failed(new Throwable(s"subscribe request: $actual"))
        }
      }
    }

    val result = CreateZuoraSubscription(
      state = state,
      requestInfo = RequestInfo(false, false, Nil, false),
      now = () => new DateTime(2020, 6, 15, 16, 28, 57),
      today = () => new LocalDate(2020, 6, 15),
      promotionService = null,// shouldn't be called for subs with no promo code
      redemptionService = null,// shouldn't be called for paid subs
      zuoraService = zuora,
      config = ZuoraConfig(url = null, username = null, password = null, monthlyContribution = null, annualContribution = null, digitalPack = ZuoraDigitalPackConfig(14, 2))
    )

    result.map { handlerResult =>
      withClue(handlerResult) {
        handlerResult.value.accountNumber should be("accountdigi")
        handlerResult.value.subscriptionNumber should be("subdigi")
        handlerResult.value.paymentMethod.isLeft should be(true) // it's still marked as a paid sub!
      }
    }
  }

}
