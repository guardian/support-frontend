package com.gu.support.workers.lambdas

import com.gu.support.catalog.{CatalogService, SimpleJsonProvider}
import com.gu.support.config.TouchPointEnvironments.PROD
import com.gu.support.workers.lambdas.UpdateSupporterProductDataSpec.{
  digitalSubscriptionGiftRedemptionState,
  digitalSusbcriptionGiftPurchaseState,
  serviceWithFixtures,
  supporterPlusState,
}
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.supporterdata.model.ContributionAmount
import io.circe.parser._
import org.scalatest.EitherValues
import org.scalatest.Inside.inside
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers.convertToAnyShouldWrapper
import org.scalatest.OptionValues._

import scala.io.Source

class UpdateSupporterProductDataSpec extends AnyFlatSpec with EitherValues {

  "UpdateSupporterProductData" should "not insert an item into Dynamo for a digisub gift purchase" in {
    val state = decode[SendThankYouEmailState](digitalSusbcriptionGiftPurchaseState).value
    val supporterRatePlanItem =
      UpdateSupporterProductData.getSupporterRatePlanItemFromState(state, serviceWithFixtures).value

    supporterRatePlanItem shouldBe None
  }

  "UpdateSupporterProductData" should "return a valid SupporterRatePlanItem for a digisub gift redemption" in {
    val state = decode[SendThankYouEmailState](digitalSubscriptionGiftRedemptionState).value
    val supporterRatePlanItem =
      UpdateSupporterProductData.getSupporterRatePlanItemFromState(state, serviceWithFixtures).value

    supporterRatePlanItem.value.identityId shouldBe "102803446"
  }

  "UpdateSupporterProductData" should "return a valid SupporterRatePlanItem for a Supporter Plus purchase" in {
    val state = decode[SendThankYouEmailState](supporterPlusState).value
    val supporterRatePlanItem =
      UpdateSupporterProductData.getSupporterRatePlanItemFromState(state, serviceWithFixtures).value
    supporterRatePlanItem.value.identityId shouldBe "200092951"
    supporterRatePlanItem.value.contributionAmount shouldBe None // not guaranteed right if discounted, and unused anyway
  }
}

object UpdateSupporterProductDataSpec {

  val supporterPlusState =
    """
      {
          "user": {
            "id": "200092951",
            "primaryEmailAddress": "test+2343343jj28323@test.com",
            "title": null,
            "firstName": "yy",
            "lastName": "yy",
            "billingAddress": {
              "lineOne": null,
              "lineTwo": null,
              "city": null,
              "state": "",
              "postCode": null,
              "country": "GB"
            },
            "deliveryAddress": null,
            "telephoneNumber": null,
            "isTestUser": false,
            "deliveryInstructions": null
          },
          "product": {
            "amount": 12,
            "currency": "GBP",
            "billingPeriod": "Monthly",
            "productType": "SupporterPlus"
          },
          "paymentMethod": {
            "TokenId": "pm_0MZap9ItVxyc3Q6nRNfyJHfO",
            "SecondTokenId": "cus_NKFK2NAwJc9tH3",
            "CreditCardNumber": "4242",
            "CreditCardCountry": "US",
            "CreditCardExpirationMonth": 2,
            "CreditCardExpirationYear": 2029,
            "CreditCardType": "Visa",
            "PaymentGateway": "Stripe PaymentIntents GNM Membership",
            "Type": "CreditCardReferenceTransaction",
            "StripePaymentType": "StripeCheckout"
          },
          "paymentSchedule": {
            "payments": [
              {
                "date": "2024-01-08",
                "amount": 20
              }
            ]
          },
          "accountNumber": "A00485141",
          "subscriptionNumber": "A-S00489451",
          "productType": "SupporterPlus"
        }
    """

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
  lazy val catalogSource = Source.fromURL(getClass.getResource("/catalog.json"))
  lazy val catalog: String = {
    val catalogString = catalogSource.mkString
    catalogSource.close()
    catalogString
  }

  private val json = parse(catalog).toOption.get
  private val jsonProvider = new SimpleJsonProvider(json)
  val serviceWithFixtures = new CatalogService(PROD, jsonProvider)
}
