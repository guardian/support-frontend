package com.gu.support.workers.lambdas

import com.gu.support.catalog.{CatalogService, SimpleJsonProvider}
import com.gu.support.config.TouchPointEnvironments.PROD
import com.gu.support.workers.lambdas.UpdateSupporterProductDataSpec.{
  digitalSubscriptionGiftRedemptionState,
  digitalSusbcriptionGiftPurchaseState,
  serviceWithFixtures,
}
import com.gu.support.workers.states.SendThankYouEmailState
import io.circe.parser._
import org.scalatest.Inside.inside
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers.convertToAnyShouldWrapper
import org.scalatest.OptionValues._

import scala.io.Source

class UpdateSupporterProductDataSpec extends AnyFlatSpec {

  "UpdateSupporterProductData" should "not insert an item into Dynamo for a digisub gift purchase" in {
    val state = decode[SendThankYouEmailState](digitalSusbcriptionGiftPurchaseState)
    state.isRight shouldBe true
    val supporterRatePlanItem = UpdateSupporterProductData
      .getSupporterRatePlanItemFromState(state.toOption.get, serviceWithFixtures)
    inside(supporterRatePlanItem) { case Right(value) =>
      value shouldBe None
    }
  }

  "UpdateSupporterProductData" should "return a valid SupporterRatePlanItem for a digisub gift redemption" in {
    val state = decode[SendThankYouEmailState](digitalSubscriptionGiftRedemptionState)
    state.isRight shouldBe true
    val supporterRatePlanItem = UpdateSupporterProductData
      .getSupporterRatePlanItemFromState(state.toOption.get, serviceWithFixtures)
    inside(supporterRatePlanItem) { case Right(item) =>
      item.value.identityId shouldBe "102803446"
    }
  }
}

object UpdateSupporterProductDataSpec {

  val digitalSubscriptionGiftRedemptionState = """
    {
      "user": {
        "id": "102803446",
        "primaryEmailAddress": "testtest@gmail.com",
        "title": null,
        "firstName": "Harry",
        "lastName": "Stiles",
        "billingAddress": {
          "lineOne": null,
          "lineTwo": null,
          "city": null,
          "state": null,
          "postCode": null,
          "country": "GB"
        },
        "deliveryAddress": null,
        "telephoneNumber": null,
        "isTestUser": false,
        "deliveryInstructions": null
      },
      "product": {
        "currency": "GBP",
        "billingPeriod": "Quarterly",
        "readerType": "Gift",
        "productType": "DigitalPack"
      },
      "subscriptionNumber": "A-S0XXXXXXXX",
      "termDates": {
        "giftStartDate": "2021-04-29",
        "giftEndDate": "2029-04-29",
        "months": 12
      },
      "productType": "DigitalSubscriptionGiftRedemption"
    }
  """

  val digitalSusbcriptionGiftPurchaseState = """
    {
      "user": {
        "id": "100569339",
        "primaryEmailAddress": "sdflkjsd@sflk.com",
        "title": null,
        "firstName": "Foo",
        "lastName": "Bar",
        "billingAddress": {
          "lineOne": "My house",
          "lineTwo": null,
          "city": "Kin Kora",
          "state": "QLD",
          "postCode": "1111",
          "country": "AU"
        },
        "deliveryAddress": null,
        "telephoneNumber": "+615555555555",
        "isTestUser": false,
        "deliveryInstructions": null
      },
      "recipientSFContactId": "0035I0XXXXXXXXXX",
      "product": {
        "currency": "AUD",
        "billingPeriod": "Annual",
        "readerType": "Gift",
        "productType": "DigitalPack"
      },
      "giftRecipient": {
        "firstName": "FirstName",
        "lastName": "LastName",
        "email": "blah@test.com",
        "message": "Happy Birthday\nHours of happy reading.",
        "deliveryDate": "2021-05-01",
        "giftRecipientType": "DigitalSubscription"
      },
      "giftCode": "gd12-xxxxxxxx",
      "lastRedemptionDate": "2029-04-28",
      "paymentMethod": {
        "TokenId": "xxxxxxxxxxxxxxx",
        "SecondTokenId": "xxxxxxxxxxxx",
        "CreditCardNumber": "0335",
        "CreditCardCountry": "AU",
        "CreditCardExpirationMonth": 3,
        "CreditCardExpirationYear": 2028,
        "CreditCardType": "MasterCard",
        "PaymentGateway": "Stripe PaymentIntents GNM Membership AUS",
        "Type": "CreditCardReferenceTransaction",
        "StripePaymentType": "StripeCheckout"
      },
      "paymentSchedule": {
        "payments": [
          {
            "date": "2021-04-29",
            "amount": 175
          }
        ]
      },
      "promoCode": null,
      "accountNumber": "A0XXXXXXXX",
      "subscriptionNumber": "A-S014XXXXXX",
      "productType": "DigitalSubscriptionGiftPurchase"
    }
  """

  lazy val catalog: String = Source.fromURL(getClass.getResource("/catalog.json")).mkString

  private val json = parse(catalog).toOption.get
  private val jsonProvider = new SimpleJsonProvider(json)
  val serviceWithFixtures = new CatalogService(PROD, jsonProvider)
}
