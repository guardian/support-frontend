package com.gu.support.workers

import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency, Title}
import com.gu.salesforce.Fixtures.{emailAddress, idId}
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.catalog.{Domestic, Everyday, HomeDelivery, RestOfWorld}
import com.gu.support.promotions.PromoCode
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.{
  ContributionState,
  DigitalSubscriptionCorporateRedemptionState,
  DigitalSubscriptionDirectPurchaseState,
  DigitalSubscriptionGiftPurchaseState,
  DigitalSubscriptionGiftRedemptionState,
  GuardianWeeklyState,
  PaperState,
  SupporterPlusState,
}
import com.gu.support.workers.states.{AnalyticsInfo, CreateZuoraSubscriptionProductState, CreateZuoraSubscriptionState}
import com.gu.support.zuora.api.StripeGatewayDefault
import io.circe.parser
import io.circe.syntax._
import org.joda.time.{DateTimeZone, LocalDate}

import java.io.ByteArrayInputStream
import java.util.UUID

//noinspection TypeAnnotation
object JsonFixtures {

  def wrapFixture(string: String): ByteArrayInputStream =
    JsonWrapper(
      parser.parse(string).toOption.get,
      None,
      RequestInfo(testUser = false, failed = false, Nil, accountExists = false),
    ).asJson.noSpaces.asInputStream

  def user(id: String = idId): User =
    User(
      id,
      emailAddress,
      None,
      "test",
      "user",
      billingAddress = Address(
        Some("The Guardian"),
        Some("Kings Place"),
        Some("london"),
        None,
        Some("n1 9gu"),
        Country.UK,
      ),
      deliveryInstructions = Some("Leave with neighbour"),
    )
  def userJson(id: String = idId): String =
    s"""
      "user":{
          "id": "$id",
          "primaryEmailAddress": "$emailAddress",
          "firstName": "test",
          "lastName": "user",
          "country": "GB",
          "billingAddress": {
            "country": "GB",
            "lineOne": "The Guardian",
            "lineTwo": "Kings Place",
            "city": "london",
            "postCode": "n1 9gu"
          },
          "isTestUser": false,
          "deliveryInstructions": "Leave with neighbour"
        }
    """

  def userJsonNoAddress: String =
    s"""
      "user":{
          "id": "$idId",
          "primaryEmailAddress": "$emailAddress",
          "firstName": "test",
          "lastName": "user",
          "billingAddress": {
            "country": "GB"
          },
          "isTestUser": false
        }
    """

  def userJsonAlternate(id: String = idId): String =
    s"""
      "user":{
          "id": "$id",
          "primaryEmailAddress": "$emailAddress",
          "firstName": "test",
          "lastName": "user",
          "country": "GB",
          "billingAddress": {
            "country": "GB",
            "lineOne": "22 Monkey Street",
            "lineTwo": "",
            "city": "Birmingham",
            "postCode": "BM66AJ"
          },
          "isTestUser": false,
          "deliveryInstructions": "Leave with neighbour"
        }
    """

  val userJsonWithDeliveryAddress =
    User(
      idId,
      emailAddress,
      None,
      "test",
      "user",
      billingAddress = Address(
        Some("yaw kroy 09"),
        None,
        Some("london"),
        None,
        Some("n1 9gu"),
        Country.UK,
      ),
      deliveryAddress = Some(
        Address(
          Some("90 york way"),
          None,
          Some("london"),
          None,
          Some("n1 9gu"),
          Country.UK,
        ),
      ),
      deliveryInstructions = Some("Leave with neighbour"),
    )

  def requestIdJson: String = s""""requestId": "${UUID.randomUUID()}\""""
  val validBaid = "B-23637766K5365543J"
  val payPalEmail = "test@paypal.com"
  val payPalPaymentMethod =
    s"""
        {
              "PaypalBaid": "$validBaid",
              "PaypalEmail": "$payPalEmail",
              "PaypalType": "ExpressCheckout",
              "Type": "PayPal",
              "PaymentGateway": "PayPal Express"
         }
       """

  val stripePaymentMethodObj =
    CreditCardReferenceTransaction(
      "card_E0zitFfsO2wTEn",
      "cus_E0zic0cedDT5MZ",
      "4242",
      Some(Country.US),
      2,
      2029,
      Some("Visa"),
      StripeGatewayDefault,
      StripePaymentType = None,
    )
  val stripePaymentMethod = // test env card and cus token, not prod ones
    s"""
        {
           "TokenId": "card_E0zitFfsO2wTEn",
           "SecondTokenId": "cus_E0zic0cedDT5MZ",
           "CreditCardNumber": "4242",
           "CreditCardCountry": "US",
           "CreditCardExpirationMonth": 2,
           "CreditCardExpirationYear": 2029,
           "CreditCardType": "Visa",
           "Type": "CreditCardReferenceTransaction",
           "PaymentGateway": "Stripe Gateway 1"
         }
       """

  def contribution(amount: BigDecimal = 5, currency: Currency = GBP, billingPeriod: BillingPeriod = Monthly): String =
    s"""
      {
        "productType": "Contribution",
        "amount": $amount,
        "currency": "$currency",
        "billingPeriod": "$billingPeriod"
      }
    """

  val digitalPackJson =
    """
      {
        "productType": "DigitalPack",
        "currency": "GBP",
        "billingPeriod" : "Annual",
        "readerType": "Direct"
      }
    """

  val digitalPackCorporateJson =
    """
      {
        "productType": "DigitalPack",
        "currency": "GBP",
        "billingPeriod" : "Annual",
        "readerType" : "Corporate"
      }
    """

  val digitalPackGiftJson =
    """
      {
        "productType": "DigitalPack",
        "currency": "GBP",
        "billingPeriod" : "Annual",
        "readerType" : "Gift"
      }
    """

  val everydayPaperJson =
    """
      {
        "productType": "Paper",
        "currency": "GBP",
        "billingPeriod" : "Monthly",
        "fulfilmentOptions" : "HomeDelivery",
        "productOptions" : "Everyday"
      }
    """

  val weeklyJson = GuardianWeekly(GBP, Monthly, Domestic).asJson.spaces2

  val digitalPackProductJson =
    s"""
      "product": $digitalPackJson
    """

  val payPalJson =
    s"""
      {
        "baid": "$validBaid"
      }
    """

  val acquisitionData =
    s"""
      {
        "ophanIds":{
          "pageviewId":"jkcg440imu1c0m8pxpxe",
          "visitId":null,
          "browserId":null
        },
        "referrerAcquisitionData":{
          "source": "GUARDIAN_WEB",
          "componentId": "header_support",
          "componentType": "ACQUISITIONS_HEADER",
          "campaignCode": "header_support",
          "referrerPageviewId": "kirbr24j42oda63r9c1s",
          "referrerUrl": "https://www.theguardian.com/uk",
          "abTests":[{
            "name":"fakeTest",
            "variant":"fakeVariant"
          }],
          "hostname": "support.code.dev-theguardian.com"
        },
        "supportAbTests":[{
          "name":"fakeSupportTest",
          "variant":"fakeVariant"
        }]
      }
    """

  val mickeyMouse = "Mickey Mouse"
  val directDebitJson =
    s"""
      {
        "accountHolderName": "$mickeyMouse",
        "sortCode": "111111",
        "accountNumber": "99999999"
      }
    """

  val stripeToken = "tok_visa"
  val stripePaymentMethodToken = PaymentMethodId("pm_card_visa").get
  val stripeJson =
    s"""
      {
        "stripeToken": "$stripeToken",
        "stripePaymentType": "StripeCheckout"
      }
    """

  val stripePaymentMethodJson =
    s"""
      {
        "paymentMethod": "${stripePaymentMethodToken.value}",
        "stripePaymentType": "StripeCheckout"
      }
    """

  def createPayPalPaymentMethodContributionJson(currency: Currency = GBP): String =
    s"""{
          $requestIdJson,
          ${userJson()},
          "product": ${contribution(currency = currency)},
          "analyticsInfo": {
            "paymentProvider": "PayPal",
            "isGiftPurchase": false
          },
          "paymentFields": $payPalJson,
          "acquisitionData": $acquisitionData,
          "ipAddress": "127.0.0.1",
          "userAgent": "Test"
        }"""

  def createStripeSourcePaymentMethodContributionJson(
      billingPeriod: BillingPeriod = Monthly,
      amount: BigDecimal = 5,
      currency: Currency = GBP,
  ): String =
    s"""{
          $requestIdJson,
          ${userJson()},
          "product": ${contribution(amount = amount, billingPeriod = billingPeriod, currency = currency)},
          "analyticsInfo": {
            "paymentProvider": "Stripe",
            "isGiftPurchase": false
          },
          "paymentFields": $stripeJson,
          "sessionId": "testingToken",
          "acquisitionData": $acquisitionData,
          "ipAddress": "127.0.0.1",
          "userAgent": "Test"
        }"""

  def createStripePaymentMethodPaymentMethodContributionJson(
      billingPeriod: BillingPeriod = Monthly,
      amount: BigDecimal = 5,
      currency: Currency = GBP,
  ): String =
    s"""{
          $requestIdJson,
          ${userJson()},
          "product": ${contribution(amount = amount, billingPeriod = billingPeriod, currency = currency)},
          "analyticsInfo": {
            "paymentProvider": "Stripe",
            "isGiftPurchase": false
          },
          "paymentFields": $stripePaymentMethodJson,
          "sessionId": "testingToken",
          "acquisitionData": $acquisitionData,
          "ipAddress": "127.0.0.1",
          "userAgent": "Test"
        }"""

  val createPayPalPaymentMethodDigitalPackJson =
    s"""{
          $requestIdJson,
          ${userJson()},
          $digitalPackProductJson,
          "analyticsInfo": {
            "paymentProvider": "PayPal",
            "isGiftPurchase": false
          },
          "paymentFields": $payPalJson,
          "ipAddress": "127.0.0.1",
          "userAgent": "Test"
        }"""

  val createDirectDebitDigitalPackJson =
    s"""{
          $requestIdJson,
          ${userJson()},
          $digitalPackProductJson,
          "analyticsInfo": {
            "paymentProvider": "DirectDebit",
            "isGiftPurchase": false
          },
          "paymentFields": $directDebitJson
        }"""

  val createSalesForceContactJson =
    s"""
          {
            $requestIdJson,
            ${userJson("200001969")},
            "product": ${contribution()},
          "analyticsInfo": {
            "paymentProvider": "PayPal",
            "isGiftPurchase": false
          },
            "paymentMethod": $payPalPaymentMethod
          }
        """

  val createSalesForceGiftContactJson =
    s"""
          {
            $requestIdJson,
            ${userJson()},
            "product": ${weeklyJson},
            "analyticsInfo": {
              "paymentProvider": "PayPal",
              "isGiftPurchase": true
            },
            "paymentMethod": $payPalPaymentMethod,
            "firstDeliveryDate": "${LocalDate.now(DateTimeZone.UTC)}",
            "giftRecipient": {
              "title": "Mr",
              "firstName": "Gifty",
              "lastName": "McRecipent",
              "email": "gift.recipient@thegulocal.com",
              "giftRecipientType": "Weekly"
            }
          }
        """

  val salesforceContact =
    SalesforceContactRecord(
      "0033E00001Cq8D2QAJ",
      "0013E00001AU6xcQAD",
    )
  val salesforceContacts = {
    SalesforceContactRecords(
      SalesforceContactRecord(
        "0033E00001Cq8D2QAJ",
        "0013E00001AU6xcQAD",
      ),
      Some(
        SalesforceContactRecord(
          "0033E00001Cq8D2QAJ",
          "0013E00001AU6xcQAD",
        ),
      ),
    )
  }
  val salesforceContactJson =
    """
        {
          "Id": "0033E00001Cq8D2QAJ",
          "AccountId": "0013E00001AU6xcQAD"
        }
      """

  val salesforceContactsJson =
    """
       "salesforceContacts": {
          "buyer": {
            "Id": "0033E00001Cq8D2QAJ",
            "AccountId": "0013E00001AU6xcQAD"
          },
          "giftRecipient": {
            "Id": "0033E00001Cq8D2QAJ",
            "AccountId": "0013E00001AU6xcQAD"
          }
        }
      """

  def createContributionZuoraSubscriptionJson(billingPeriod: BillingPeriod = Monthly): String =
    CreateZuoraSubscriptionState(
      ContributionState(
        Contribution(5, GBP, billingPeriod),
        stripePaymentMethodObj,
        salesforceContact,
      ),
      UUID.randomUUID(),
      user(),
      Contribution(5, GBP, billingPeriod),
      AnalyticsInfo(false, Stripe),
      None,
      None,
      None,
      None,
      None,
    ).asJson.spaces2

  val createSupporterPlusZuoraSubscriptionJson =
    CreateZuoraSubscriptionState(
      SupporterPlusState(
        SupporterPlus(12, GBP, Monthly),
        stripePaymentMethodObj,
        salesforceContact,
      ),
      UUID.randomUUID(),
      user("9999998"),
      SupporterPlus(12, GBP, Monthly),
      AnalyticsInfo(false, Stripe),
      None,
      None,
      None,
      None,
      None,
    ).asJson.spaces2

  val createDigiPackZuoraSubscriptionJson =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionDirectPurchaseState(
        Country.UK,
        DigitalPack(GBP, Annual),
        stripePaymentMethodObj,
        None,
        salesforceContact,
      ),
      UUID.randomUUID(),
      user(),
      DigitalPack(GBP, Annual),
      AnalyticsInfo(false, Stripe),
      None,
      None,
      None,
      None,
      None,
    ).asJson.spaces2

  val createDigiPackCorporateSubscriptionJson =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionCorporateRedemptionState(
        DigitalPack(GBP, Annual),
        RedemptionData(RedemptionCode("it-mutable123").toOption.get),
        salesforceContact,
      ),
      UUID.randomUUID(),
      user(),
      DigitalPack(GBP, Annual),
      AnalyticsInfo(false, Stripe),
      None,
      None,
      None,
      None,
      None,
    ).asJson.spaces2

  def createDigiPackGiftSubscriptionJson(requestId: UUID): String =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionGiftPurchaseState(
        Country.UK,
        DigitalSubscriptionGiftRecipient(
          "Gifty",
          "McRecipent",
          "gift.recipient@thegulocal.com",
          None,
          new LocalDate(2020, 1, 1),
        ),
        DigitalPack(GBP, Annual),
        stripePaymentMethodObj,
        None,
        salesforceContacts,
      ),
      requestId,
      user(),
      DigitalPack(GBP, Annual),
      AnalyticsInfo(false, Stripe),
      None,
      None,
      None,
      None,
      None,
    ).asJson.spaces2

  def createDigiPackGiftRedemptionJson(code: String): String =
    (DigitalSubscriptionGiftRedemptionState(
      idId,
      DigitalPack(GBP, Annual),
      RedemptionData(RedemptionCode(code).toOption.get),
    ): CreateZuoraSubscriptionProductState).asJson.spaces2

  val createDigiPackSubscriptionWithPromoJson =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionDirectPurchaseState(
        Country.UK,
        DigitalPack(GBP, Annual),
        stripePaymentMethodObj,
        Some("DJP8L27FY"),
        salesforceContact,
      ),
      UUID.randomUUID(),
      user(),
      DigitalPack(GBP, Annual),
      AnalyticsInfo(false, Stripe),
      None,
      None,
      None,
      None,
      None,
    ).asJson.spaces2

  val createEverydayPaperSubscriptionJson =
    CreateZuoraSubscriptionState(
      PaperState(
        userJsonWithDeliveryAddress,
        Paper(GBP, Monthly, HomeDelivery, Everyday),
        stripePaymentMethodObj,
        LocalDate.now(DateTimeZone.UTC),
        None,
        salesforceContact,
      ),
      UUID.randomUUID(),
      userJsonWithDeliveryAddress,
      Paper(GBP, Monthly, HomeDelivery, Everyday),
      AnalyticsInfo(false, Stripe),
      None,
      None,
      None,
      None,
      None,
    ).asJson.spaces2

  def createGuardianWeeklySubscriptionJson(
      billingPeriod: BillingPeriod,
      maybePromoCode: Option[PromoCode] = None,
  ): String =
    CreateZuoraSubscriptionState(
      GuardianWeeklyState(
        userJsonWithDeliveryAddress,
        None,
        GuardianWeekly(GBP, billingPeriod, RestOfWorld),
        stripePaymentMethodObj,
        LocalDate.now(DateTimeZone.UTC).plusDays(10),
        maybePromoCode,
        salesforceContacts,
      ),
      UUID.randomUUID(),
      userJsonWithDeliveryAddress,
      GuardianWeekly(GBP, billingPeriod, RestOfWorld),
      AnalyticsInfo(false, Stripe),
      Some(LocalDate.now(DateTimeZone.UTC).plusDays(10)),
      maybePromoCode,
      None,
      None,
      None,
    ).asJson.spaces2

  val guardianWeeklyGiftJson =
    CreateZuoraSubscriptionState(
      GuardianWeeklyState(
        userJsonWithDeliveryAddress,
        Some(
          WeeklyGiftRecipient(
            Some(Title.Mr),
            "Harry",
            "Ramsden",
            None,
          ),
        ),
        GuardianWeekly(GBP, Quarterly, RestOfWorld),
        stripePaymentMethodObj,
        LocalDate.now(DateTimeZone.UTC).plusDays(10),
        None,
        salesforceContacts,
      ),
      UUID.randomUUID(),
      userJsonWithDeliveryAddress,
      GuardianWeekly(GBP, Quarterly, RestOfWorld),
      AnalyticsInfo(false, Stripe),
      Some(LocalDate.now(DateTimeZone.UTC).plusDays(10)),
      None,
      None,
      None,
      None,
    ).asJson.spaces2

  val failureJson =
    """{
          "state": {"requestId":"e18f6418-45f2-11e7-8bfa-8faac2182601","user":{"id":"12345","primaryEmailAddress":"test@thegulocal.com","firstName":"test","lastName":"user","country":"GB","billingAddress":{"country":"GB"},"isTestUser":false},"product":{"productType":"Contribution","amount":5,"currency":"GBP","billingPeriod":"Annual"},"analyticsInfo":{"paymentProvider": "Stripe","isGiftPurchase":false},"paymentMethod":{"TokenId":"card_E0zitFfsO2wTEn","SecondTokenId":"cus_E0zic0cedDT5MZ","CreditCardNumber":"4242","CreditCardCountry":"US","CreditCardExpirationMonth":2,"CreditCardExpirationYear":2029,"CreditCardType":"Visa","Type":"CreditCardReferenceTransaction","PaymentGateway":"Stripe Gateway 1"},"salesForceContact":{"Id":"0033E00001Cq8D2QAJ","AccountId":"0013E00001AU6xcQAD"},"salesforceContacts":{"buyer":{"Id":"0033E00001Cq8D2QAJ","AccountId":"0013E00001AU6xcQAD"},"giftRecipient":{"Id":"0033E00001Cq8D2QAJ","AccountId":"0013E00001AU6xcQAD"}}},
          "error": {
            "Error": "com.example.SomeError",
            "Cause": "Oh no! It's on fire!"
          },
          "requestInfo": {
            "testUser": false,
            "failed": false,
            "messages": [],
            "accountExists": false
          }
        }
     """

  // This Json uses a test Stripe token which causes Stripe to return a card_declined response, but the product is a digital pack
  val digipackCardDeclinedStripeJson =
    """
    {
      "state": {"requestId":"299f0204-8f82-f479-0000-00000000e33d","user":{"id":"30001643","primaryEmailAddress":"test@thegulocal.com","firstName":"FygxilMxB5QMoAkmuIc","lastName":"FygxilMxB5QMoAkmuIc","billingAddress":{"country":"GB"},"country":"GB","state":null,"isTestUser":false},"product":{"productType":"DigitalPack","currency":"GBP","billingPeriod":"Annual","readerType":"Direct"},"analyticsInfo":{"paymentProvider": "Stripe","isGiftPurchase":false},"paymentFields":{"userId":"30001643","stripeToken":"tok_chargeDeclined"},"acquisitionData":{"ophanIds":{"pageviewId":"jaignx8mlwazhhpaq9tk","visitId":null,"browserId":null},"referrerAcquisitionData":{"campaignCode":null,"referrerPageviewId":null,"referrerUrl":null,"componentId":null,"componentType":null,"source":null,"abTest":null},"supportAbTests":[{"name":"usRecurringCopyTest","variant":"notintest"},{"name":"ukRecurringAmountsTest","variant":"lower"},{"name":"usRecurringAmountsTest","variant":"notintest"}]}},
      "error": {
        "Error": "com.gu.support.workers.exceptions.RetryNone",
        "Cause": "{\"errorMessage\":\"{\\n  \\\"error\\\" : {\\n    \\\"type\\\" : \\\"card_error\\\",\\n    \\\"message\\\" : \\\"Your card was declined.\\\",\\n    \\\"code\\\" : \\\"card_declined\\\",\\n    \\\"decline_code\\\" : \\\"generic_decline\\\",\\n    \\\"param\\\" : \\\"\\\"\\n  }\\n}\",\"errorType\":\"com.gu.support.workers.exceptions.RetryNone\",\"stackTrace\":[\"com.gu.stripe.Stripe$StripeError.asRetryException(Stripe.scala:37)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:20)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:18)\",\"scala.runtime.AbstractPartialFunction.apply(AbstractPartialFunction.scala:36)\",\"com.gu.support.workers.lambdas.Handler.handleRequest(Handler.scala:30)\",\"sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\",\"sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\",\"sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\",\"java.lang.reflect.Method.invoke(Method.java:498)\"],\"cause\":{\"errorMessage\":\"message: Your card was declined.; type: card_error; code: card_declined; decline_code: generic_decline; param: \",\"errorType\":\"com.gu.stripe.Stripe$StripeError\",\"stackTrace\":[\"com.gu.stripe.Stripe$StripeError$anon$lazy$macro$308$1$anon$macro$304$1.from(Stripe.scala:17)\",\"com.gu.stripe.Stripe$StripeError$anon$lazy$macro$308$1$anon$macro$304$1.from(Stripe.scala:17)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:229)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:226)\",\"io.circe.generic.decoding.DerivedDecoder$$anon$1.apply(DerivedDecoder.scala:14)\",\"io.circe.Decoder$class.tryDecode(Decoder.scala:33)\",\"io.circe.generic.decoding.DerivedDecoder.tryDecode(DerivedDecoder.scala:6)\",\"io.circe.Decoder$$anon$20.tryDecode(Decoder.scala:178)\",\"io.circe.Decoder$$anon$20.apply(Decoder.scala:177)\",\"com.gu.support.workers.encoding.Codec.apply(Codec.scala:9)\",\"io.circe.Decoder$class.decodeJson(Decoder.scala:49)\",\"com.gu.support.workers.encoding.Codec.decodeJson(Codec.scala:6)\",\"io.circe.Parser$class.finishDecode(Parser.scala:11)\",\"io.circe.parser.package$.finishDecode(package.scala:5)\",\"io.circe.Parser$class.decode(Parser.scala:25)\",\"io.circe.parser.package$.decode(package.scala:5)\",\"com.gu.helpers.WebServiceHelper$class.decodeError(WebServiceHelper.scala:73)\",\"com.gu.stripe.StripeService.decodeError(StripeService.scala:11)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:59)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:54)\",\"scala.util.Success$$anonfun$map$1.apply(Try.scala:237)\",\"scala.util.Try$.apply(Try.scala:192)\",\"scala.util.Success.map(Try.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.impl.CallbackRunnable.run(Promise.scala:32)\",\"scala.concurrent.impl.ExecutionContextImpl$AdaptedForkJoinTask.exec(ExecutionContextImpl.scala:121)\",\"scala.concurrent.forkjoin.ForkJoinTask.doExec(ForkJoinTask.java:260)\",\"scala.concurrent.forkjoin.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1339)\",\"scala.concurrent.forkjoin.ForkJoinPool.runWorker(ForkJoinPool.java:1979)\",\"scala.concurrent.forkjoin.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:107)\"]}}"
      },
      "requestInfo": {
        "testUser": true,
        "failed": false,
        "messages": [],
        "accountExists": false
      }
    }
  """

  val zuoraErrorResponse =
    """[{"Code": "TRANSACTION_FAILED","Message": "Transaction declined.do_not_honor - Your card was declined."}]"""

  val cardDeclinedJsonZuora =
    """
      {
        "state": {"requestId":"e18f6418-45f2-11e7-8bfa-8faac2182601","user":{"id":"12345","primaryEmailAddress":"test@thegulocal.com","firstName":"test","lastName":"user","country":"GB","billingAddress":{"country":"GB"},"isTestUser":false},"product":{"productType":"Contribution","amount":5,"currency":"GBP","billingPeriod":"Annual"},"analyticsInfo":{"paymentProvider": "Stripe","isGiftPurchase":false},"paymentMethod":{"TokenId":"card_E0zitFfsO2wTEn","SecondTokenId":"cus_E0zic0cedDT5MZ","CreditCardNumber":"4242","CreditCardCountry":"US","CreditCardExpirationMonth":2,"CreditCardExpirationYear":2029,"CreditCardType":"Visa","Type":"CreditCardReferenceTransaction","PaymentGateway":"Stripe Gateway 1"},"salesForceContact":{"Id":"0033E00001Cq8D2QAJ","AccountId":"0013E00001AU6xcQAD"},"salesforceContacts":{"buyer":{"Id":"0033E00001Cq8D2QAJ","AccountId":"0013E00001AU6xcQAD"},"giftRecipient":{"Id":"0033E00001Cq8D2QAJ","AccountId":"0013E00001AU6xcQAD"}}},
        "error": {
          "Error": "com.gu.support.workers.exceptions.RetryNone",
          "Cause": "{\"errorMessage\":\"{\\n  \\\"Success\\\" : false,\\n  \\\"Errors\\\" : [\\n    {\\n      \\\"Code\\\" : \\\"TRANSACTION_FAILED\\\",\\n      \\\"Message\\\" : \\\"Transaction declined.generic_decline - Your card was declined.\\\"\\n    }\\n  ]\\n}\",\"errorType\":\"com.gu.support.workers.exceptions.RetryNone\",\"stackTrace\":[\"com.gu.zuora.model.response.ZuoraErrorResponse.asRetryException(Responses.scala:37)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:26)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:18)\",\"scala.runtime.AbstractPartialFunction.apply(AbstractPartialFunction.scala:36)\",\"com.gu.support.workers.lambdas.Handler.handleRequest(Handler.scala:30)\",\"sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\",\"sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\",\"sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\",\"java.lang.reflect.Method.invoke(Method.java:498)\"],\"cause\":{\"errorMessage\":\"[\\n  {\\n    \\\"Code\\\" : \\\"TRANSACTION_FAILED\\\",\\n    \\\"Message\\\" : \\\"Transaction declined.generic_decline - Your card was declined.\\\"\\n  }\\n]\",\"errorType\":\"com.gu.zuora.model.response.ZuoraErrorResponse\",\"stackTrace\":[\"com.gu.zuora.model.response.ZuoraErrorResponse$anon$lazy$macro$1415$1$anon$macro$1411$1.from(Responses.scala:21)\",\"com.gu.zuora.model.response.ZuoraErrorResponse$anon$lazy$macro$1415$1$anon$macro$1411$1.from(Responses.scala:21)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:229)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:226)\",\"io.circe.generic.decoding.DerivedDecoder$$anon$1.apply(DerivedDecoder.scala:14)\",\"io.circe.Decoder$class.tryDecode(Decoder.scala:33)\",\"io.circe.generic.decoding.DerivedDecoder.tryDecode(DerivedDecoder.scala:6)\",\"io.circe.Decoder$$anon$20.tryDecode(Decoder.scala:178)\",\"io.circe.Decoder$$anon$20.apply(Decoder.scala:177)\",\"com.gu.support.workers.encoding.Codec.apply(Codec.scala:9)\",\"io.circe.SeqDecoder.apply(SeqDecoder.scala:18)\",\"io.circe.Decoder$$anon$16.apply(Decoder.scala:111)\",\"io.circe.Decoder$class.decodeJson(Decoder.scala:49)\",\"io.circe.Decoder$$anon$16.decodeJson(Decoder.scala:110)\",\"io.circe.Parser$class.finishDecode(Parser.scala:11)\",\"io.circe.parser.package$.finishDecode(package.scala:5)\",\"io.circe.Parser$class.decode(Parser.scala:25)\",\"io.circe.parser.package$.decode(package.scala:5)\",\"com.gu.zuora.ZuoraService.decodeError(ZuoraService.scala:52)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:59)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:54)\",\"scala.util.Success$$anonfun$map$1.apply(Try.scala:237)\",\"scala.util.Try$.apply(Try.scala:192)\",\"scala.util.Success.map(Try.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.impl.CallbackRunnable.run(Promise.scala:32)\",\"scala.concurrent.impl.ExecutionContextImpl$AdaptedForkJoinTask.exec(ExecutionContextImpl.scala:121)\",\"scala.concurrent.forkjoin.ForkJoinTask.doExec(ForkJoinTask.java:260)\",\"scala.concurrent.forkjoin.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1339)\",\"scala.concurrent.forkjoin.ForkJoinPool.runWorker(ForkJoinPool.java:1979)\",\"scala.concurrent.forkjoin.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:107)\"]}}"
        },
        "requestInfo": {
          "testUser": true,
          "failed": false,
          "messages": [],
          "accountExists": false
        }
      }
     """
  val cardDeclinedJsonStripe =
    """
      {
        "state": {"requestId":"299f0204-8f82-f479-0000-00000000e33d","user":{"id":"30001643","primaryEmailAddress":"fygxilmxb5qmoakmuic@thegulocal.com","firstName":"FygxilMxB5QMoAkmuIc","lastName":"FygxilMxB5QMoAkmuIc","country":"GB","billingAddress":{"country":"GB"},"state":null,"isTestUser":false},"product":{"productType":"Contribution","currency":"GBP","billingPeriod":"Monthly","amount":5,"type":"Contribution"},"analyticsInfo":{"paymentProvider": "Stripe","isGiftPurchase":false},"paymentFields":{"userId":"30001643","stripeToken":"tok_chargeDeclined"},"acquisitionData":{"ophanIds":{"pageviewId":"jaignx8mlwazhhpaq9tk","visitId":null,"browserId":null},"referrerAcquisitionData":{"campaignCode":null,"referrerPageviewId":null,"referrerUrl":null,"componentId":null,"componentType":null,"source":null,"abTest":null},"supportAbTests":[{"name":"usRecurringCopyTest","variant":"notintest"},{"name":"ukRecurringAmountsTest","variant":"lower"},{"name":"usRecurringAmountsTest","variant":"notintest"}]}},
        "error": {
          "Error": "com.gu.support.workers.exceptions.RetryNone",
          "Cause": "{\"errorMessage\":\"{\\n  \\\"error\\\" : {\\n    \\\"type\\\" : \\\"card_error\\\",\\n    \\\"message\\\" : \\\"Your card was declined.\\\",\\n    \\\"code\\\" : \\\"card_declined\\\",\\n    \\\"decline_code\\\" : \\\"generic_decline\\\",\\n    \\\"param\\\" : \\\"\\\"\\n  }\\n}\",\"errorType\":\"com.gu.support.workers.exceptions.RetryNone\",\"stackTrace\":[\"com.gu.stripe.Stripe$StripeError.asRetryException(Stripe.scala:37)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:20)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:18)\",\"scala.runtime.AbstractPartialFunction.apply(AbstractPartialFunction.scala:36)\",\"com.gu.support.workers.lambdas.Handler.handleRequest(Handler.scala:30)\",\"sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\",\"sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\",\"sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\",\"java.lang.reflect.Method.invoke(Method.java:498)\"],\"cause\":{\"errorMessage\":\"message: Your card was declined.; type: card_error; code: card_declined; decline_code: generic_decline; param: \",\"errorType\":\"com.gu.stripe.Stripe$StripeError\",\"stackTrace\":[\"com.gu.stripe.Stripe$StripeError$anon$lazy$macro$308$1$anon$macro$304$1.from(Stripe.scala:17)\",\"com.gu.stripe.Stripe$StripeError$anon$lazy$macro$308$1$anon$macro$304$1.from(Stripe.scala:17)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:229)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:226)\",\"io.circe.generic.decoding.DerivedDecoder$$anon$1.apply(DerivedDecoder.scala:14)\",\"io.circe.Decoder$class.tryDecode(Decoder.scala:33)\",\"io.circe.generic.decoding.DerivedDecoder.tryDecode(DerivedDecoder.scala:6)\",\"io.circe.Decoder$$anon$20.tryDecode(Decoder.scala:178)\",\"io.circe.Decoder$$anon$20.apply(Decoder.scala:177)\",\"com.gu.support.workers.encoding.Codec.apply(Codec.scala:9)\",\"io.circe.Decoder$class.decodeJson(Decoder.scala:49)\",\"com.gu.support.workers.encoding.Codec.decodeJson(Codec.scala:6)\",\"io.circe.Parser$class.finishDecode(Parser.scala:11)\",\"io.circe.parser.package$.finishDecode(package.scala:5)\",\"io.circe.Parser$class.decode(Parser.scala:25)\",\"io.circe.parser.package$.decode(package.scala:5)\",\"com.gu.helpers.WebServiceHelper$class.decodeError(WebServiceHelper.scala:73)\",\"com.gu.stripe.StripeService.decodeError(StripeService.scala:11)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:59)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:54)\",\"scala.util.Success$$anonfun$map$1.apply(Try.scala:237)\",\"scala.util.Try$.apply(Try.scala:192)\",\"scala.util.Success.map(Try.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.impl.CallbackRunnable.run(Promise.scala:32)\",\"scala.concurrent.impl.ExecutionContextImpl$AdaptedForkJoinTask.exec(ExecutionContextImpl.scala:121)\",\"scala.concurrent.forkjoin.ForkJoinTask.doExec(ForkJoinTask.java:260)\",\"scala.concurrent.forkjoin.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1339)\",\"scala.concurrent.forkjoin.ForkJoinPool.runWorker(ForkJoinPool.java:1979)\",\"scala.concurrent.forkjoin.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:107)\"]}}"
        },
        "requestInfo": {
          "testUser": true,
          "failed": false,
          "messages": [],
          "accountExists": false
        }
      }
    """
  val testTokenInProdJsonStripe =
    """
      {
        "state": {"requestId":"299f0204-8f82-f479-0000-00000000e33d","user":{"id":"30001643","primaryEmailAddress":"fygxilmxb5qmoakmuic@thegulocal.com","firstName":"FygxilMxB5QMoAkmuIc","lastName":"FygxilMxB5QMoAkmuIc","country":"GB","billingAddress":{"country":"GB"},"state":null,"isTestUser":false},"product":{"productType":"Contribution","currency":"GBP","billingPeriod":"Monthly","amount":5,"type":"Contribution"},"analyticsInfo":{"paymentProvider": "Stripe","isGiftPurchase":false},"paymentFields":{"userId":"30001643","stripeToken":"tok_chargeDeclined"},"acquisitionData":{"ophanIds":{"pageviewId":"jaignx8mlwazhhpaq9tk","visitId":null,"browserId":null},"referrerAcquisitionData":{"campaignCode":null,"referrerPageviewId":null,"referrerUrl":null,"componentId":null,"componentType":null,"source":null,"abTest":null},"supportAbTests":[{"name":"usRecurringCopyTest","variant":"notintest"},{"name":"ukRecurringAmountsTest","variant":"lower"},{"name":"usRecurringAmountsTest","variant":"notintest"}]}},
        "error": {
          "Error": "com.gu.support.workers.exceptions.RetryNone",
          "Cause": "{\"errorMessage\":\"{\\\"error\\\":{\\\"type\\\":\\\"invalid_request_error\\\",\\\"message\\\":\\\"No such token: tok_G7MfIak5ICDTMg; a similar object exists in test mode, but a live mode key was used to make this request.\\\",\\\"code\\\":\\\"resource_missing\\\",\\\"decline_code\\\":null,\\\"param\\\":\\\"source\\\"}}\",\"errorType\":\"com.gu.support.workers.exceptions.RetryNone\",\"stackTrace\":[\"com.gu.support.workers.exceptions.RetryImplicits$StripeConversions$.asRetryException$extension(RetryImplicits.scala:39)\",\"com.gu.support.workers.exceptions.ErrorHandler$.$anonfun$handleException$1(ErrorHandler.scala:20)\",\"com.gu.support.workers.lambdas.Handler$$anonfun$handleRequestFuture$6.applyOrElse(Handler.scala:48)\",\"com.gu.support.workers.lambdas.Handler$$anonfun$handleRequestFuture$6.applyOrElse(Handler.scala:47)\",\"scala.runtime.AbstractPartialFunction.apply(AbstractPartialFunction.scala:38)\",\"scala.util.Failure.recover(Try.scala:234)\",\"scala.concurrent.Future.$anonfun$recover$1(Future.scala:395)\",\"scala.concurrent.impl.Promise.liftedTree1$1(Promise.scala:33)\",\"scala.concurrent.impl.Promise.$anonfun$transform$1(Promise.scala:33)\",\"scala.concurrent.impl.CallbackRunnable.run(Promise.scala:64)\",\"java.util.concurrent.ForkJoinTask$RunnableExecuteAction.exec(ForkJoinTask.java:1402)\",\"java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:289)\",\"java.util.concurrent.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1056)\",\"java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1692)\",\"java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:157)\"],\"cause\":{\"errorMessage\":\"message: No such token: tok_G7MfIak5ICDTMg; a similar object exists in test mode, but a live mode key was used to make this request.; type: invalid_request_error; code: resource_missing; decline_code: ; param: source\",\"errorType\":\"com.gu.stripe.StripeError\",\"stackTrace\":[\"com.gu.stripe.StripeError$anon$lazy$macro$31$1$anon$macro$29$1.from(StripeError.scala:24)\",\"com.gu.stripe.StripeError$anon$lazy$macro$31$1$anon$macro$29$1.from(StripeError.scala:24)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:229)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:226)\",\"io.circe.generic.decoding.DerivedDecoder$$anon$1.apply(DerivedDecoder.scala:15)\",\"io.circe.Decoder.tryDecode(Decoder.scala:46)\",\"io.circe.Decoder.tryDecode$(Decoder.scala:45)\",\"io.circe.generic.decoding.DerivedDecoder.tryDecode(DerivedDecoder.scala:6)\",\"io.circe.Decoder$$anon$11.tryDecode(Decoder.scala:263)\",\"io.circe.Decoder$$anon$11.apply(Decoder.scala:262)\",\"io.circe.Decoder.decodeJson(Decoder.scala:64)\",\"io.circe.Decoder.decodeJson$(Decoder.scala:64)\",\"io.circe.Decoder$$anon$11.decodeJson(Decoder.scala:261)\",\"io.circe.Parser.finishDecode(Parser.scala:13)\",\"io.circe.Parser.finishDecode$(Parser.scala:9)\",\"io.circe.parser.package$.finishDecode(package.scala:5)\",\"io.circe.Parser.decode(Parser.scala:29)\",\"io.circe.Parser.decode$(Parser.scala:28)\",\"io.circe.parser.package$.decode(package.scala:5)\",\"com.gu.rest.WebServiceHelper.decodeError(WebServiceHelper.scala:127)\",\"com.gu.rest.WebServiceHelper.decodeError$(WebServiceHelper.scala:127)\",\"com.gu.stripe.StripeService.decodeError(StripeService.scala:22)\",\"com.gu.rest.WebServiceHelper.decodeBody(WebServiceHelper.scala:111)\",\"com.gu.rest.WebServiceHelper.decodeBody$(WebServiceHelper.scala:95)\",\"com.gu.stripe.StripeService.decodeBody(StripeService.scala:22)\",\"com.gu.rest.WebServiceHelper.$anonfun$request$5(WebServiceHelper.scala:76)\",\"scala.concurrent.Future.$anonfun$flatMap$1(Future.scala:307)\",\"scala.concurrent.impl.Promise.$anonfun$transformWith$1(Promise.scala:41)\",\"scala.concurrent.impl.CallbackRunnable.run(Promise.scala:64)\",\"java.util.concurrent.ForkJoinTask$RunnableExecuteAction.exec(ForkJoinTask.java:1402)\",\"java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:289)\",\"java.util.concurrent.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1056)\",\"java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1692)\",\"java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:157)\"]}}"
        },
        "requestInfo": {
          "testUser": true,
          "failed": false,
          "messages": [],
          "accountExists": false
        }
      }
    """

  val wrapperWithMessages =
    """
      {
        "state": {"requestId":"a64ad98e-5d39-4ffc-a4a9-217357dc2b19","user":{"id":"9999999","primaryEmailAddress":"integration-test@thegulocal.com","firstName":"test","lastName":"user","country":"GB","billingAddress":{"country":"GB"},"isTestUser":false},"product":{"productType":"Contribution","amount":5,"currency":"GBP","billingPeriod":"Monthly"},"analyticsInfo":{"paymentProvider": "Stripe","isGiftPurchase":false},"paymentMethod":{"PaypalBaid":"B-23637766K5365543J","PaypalEmail":"test@paypal.com","PaypalType":"ExpressCheckout","Type":"PayPal","PaymentGateway":"PayPal Express"},"giftRecipient":{"title":"Mr","firstName":"Gifty","lastName":"McRecipent","email":"gift.recipient@thegulocal.com","giftRecipientType":"Weekly"}},
        "error": null,
        "requestInfo": {
          "testUser": false,
          "failed": false,
          "messages": [
            "Payment method is Stripe"
          ],
          "accountExists": false
        }
      }
    """

  val sendAcquisitionEventJson =
    s"""{
          $requestIdJson,
          "analyticsInfo": {
            "paymentProvider": "Stripe",
            "isGiftPurchase": false
          },
          "sendThankYouEmailState": {
            "productType": "Contribution",
            ${userJson()},
            "salesForceContact": {
                "Id": "0036E00000VlOPDQA3",
                "AccountId": "0016E00000f17pYQAQ"
            },
            "product": ${contribution(currency = GBP)},
            "paymentMethod": $stripePaymentMethod,
            "accountNumber": "accountnumber123",
            "subscriptionNumber": "subno123"
          },
          "acquisitionData": $acquisitionData
        }"""
  val sendAcquisitionEventPrintJson =
    s"""
    {
      "requestId": "1a94c891-e98a-13ae-0000-0000000038a3",
      "sendThankYouEmailState": {
        "user": {
          "id": "200004237",
          "primaryEmailAddress": "rupert.bates+test-mma2@theguardian.com",
          "title": null,
          "firstName": "rupert",
          "lastName": "bates",
          "billingAddress": {
            "lineOne": "Kings Place",
            "lineTwo": "York Way",
            "city": "London",
            "state": null,
            "postCode": "N1 9GU",
            "country": "GB"
          },
          "deliveryAddress": {
            "lineOne": "Kings Place",
            "lineTwo": "York Way",
            "city": "London",
            "state": null,
            "postCode": "N1 9GU",
            "country": "GB"
          },
          "telephoneNumber": null,

          "isTestUser": false,
          "deliveryInstructions": null
        },
        "product": {
          "currency": "GBP",
          "billingPeriod": "Monthly",
          "fulfilmentOptions": "HomeDelivery",
          "productOptions": "Sixday",
          "productType": "Paper"
        },
        "paymentMethod": {
          "TokenId": "pm_0Hyx9kItVxyc3Q6ndwisZWtU",
          "SecondTokenId": "cus_Ia7OiUxIGHWyAy",
          "CreditCardNumber": "4242",
          "CreditCardCountry": "US",
          "CreditCardExpirationMonth": 2,
          "CreditCardExpirationYear": 2027,
          "CreditCardType": "Visa",
          "PaymentGateway": "Stripe PaymentIntents GNM Membership",
          "Type": "CreditCardReferenceTransaction",
          "StripePaymentType": "StripeCheckout"
        },
        "paymentSchedule": {
          "payments": []
        },
        "promoCode": "fake_code",
        "accountNumber": "A00102360",
        "subscriptionNumber": "A-S00125315",
        "firstDeliveryDate": "2020-12-19",
        "productType": "Paper"
      },
      "analyticsInfo": {
        "isGiftPurchase": false,
        "paymentProvider": "Stripe"
      },
      "acquisitionData": $acquisitionData
    }
    """

  val sendAcquisitionEventGWJson =
    """
    {
      "requestId": "1a94c891-e98a-13ae-0000-000000003f18",
      "sendThankYouEmailState": {
        "user": {
          "id": "200004237",
          "primaryEmailAddress": "rupert.bates+test-mma2@theguardian.com",
          "title": null,
          "firstName": "rupert",
          "lastName": "bates",
          "billingAddress": {
            "lineOne": "Kings Place",
            "lineTwo": "York Way",
            "city": "London",
            "state": null,
            "postCode": "N1 9GU",
            "country": "GB"
          },
          "deliveryAddress": {
            "lineOne": "Kings Place",
            "lineTwo": "York Way",
            "city": "London",
            "state": null,
            "postCode": "N1 9GU",
            "country": "GB"
          },
          "telephoneNumber": null,

          "isTestUser": false,
          "deliveryInstructions": null
        },
        "product": {
          "currency": "GBP",
          "billingPeriod": "SixWeekly",
          "fulfilmentOptions": "Domestic",
          "productType": "GuardianWeekly"
        },
        "giftRecipient": null,
        "paymentMethod": {
          "PaypalBaid": "B-8JT45264A2787164W",
          "PaypalEmail": "membership.paypal-buyer@theguardian.com",
          "PaypalType": "ExpressCheckout",
          "Type": "PayPal",
          "PaymentGateway": "PayPal Express"
        },
        "paymentSchedule": {
          "payments": [
            {
              "date": "2021-01-08",
              "amount": 6
            }
          ]
        },
        "promoCode": "6FOR6",
        "accountNumber": "A00102401",
        "subscriptionNumber": "A-S00125354",
        "firstDeliveryDate": "2021-01-08",
        "productType": "GuardianWeekly"
      },
      "analyticsInfo": {
        "isGiftPurchase": false,
        "paymentProvider": "PayPal"
      },
      "acquisitionData": {
        "ophanIds": {
          "pageviewId": "kirefisckm7vh76bd1w8",
          "visitId": null,
          "browserId": null
        },
        "referrerAcquisitionData": {
          "campaignCode": null,
          "referrerPageviewId": null,
          "referrerUrl": null,
          "componentId": null,
          "componentType": null,
          "source": null,
          "abTests": null,
          "queryParameters": [],
          "hostname": "support.code.dev-theguardian.com",
          "gaClientId": "GA1.2.1846757665.1596457717",
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
          "ipAddress": "10.248.135.37"
        },
        "supportAbTests": []
      }
    }
    """
  val digipackSubscriptionWithDiscountAndFreeTrialJson =
    CreateZuoraSubscriptionState(
      DigitalSubscriptionDirectPurchaseState(
        Country.UK,
        DigitalPack(GBP, Annual),
        stripePaymentMethodObj,
        Some("DJRHYMDS8"),
        salesforceContact,
      ),
      UUID.randomUUID(),
      user(),
      DigitalPack(GBP, Annual),
      AnalyticsInfo(false, Stripe),
      None,
      Some("DJRHYMDS8"),
      None,
      None,
      None,
    ).asJson.spaces2

  def getPaymentMethodJson(billingAccountId: String, userId: String): String =
    s"""
          {
            $requestIdJson,
            ${userJson(userId)},
            "product": ${contribution()},
          "analyticsInfo": {
            "paymentProvider": "Existing",
            "isGiftPurchase": false
          },
            "paymentFields" : {"billingAccountId" : "$billingAccountId"}
            }
        """

  val previewSubscribeResponseJson = """
    {
      "Success": true,
      "InvoiceData": [
          {
              "Invoice": {
                  "AccountId": "2c92c0f87202ccc0017209638ddb4696",
                  "AmountWithoutTax": 688.87,
                  "Amount": 688.87,
                  "TaxAmount": 0
              },
              "InvoiceItem": [
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2021-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.796+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2021-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.800+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2021-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.807+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2021-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.809+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2021-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.811+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2021-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.813+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2021-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.815+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2021-05-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-05-01",
                      "ChargeDate": "2020-05-12T15:56:59.798+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2021-05-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-05-01",
                      "ChargeDate": "2020-05-12T15:56:59.799+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2021-05-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-05-01",
                      "ChargeDate": "2020-05-12T15:56:59.800+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2021-05-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-05-01",
                      "ChargeDate": "2020-05-12T15:56:59.801+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2021-05-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-05-01",
                      "ChargeDate": "2020-05-12T15:56:59.812+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2021-05-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-05-01",
                      "ChargeDate": "2020-05-12T15:56:59.812+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2021-05-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-05-01",
                      "ChargeDate": "2020-05-12T15:56:59.815+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2021-04-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-04-01",
                      "ChargeDate": "2020-05-12T15:56:59.799+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2021-04-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-04-01",
                      "ChargeDate": "2020-05-12T15:56:59.800+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2021-04-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-04-01",
                      "ChargeDate": "2020-05-12T15:56:59.803+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2021-04-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-04-01",
                      "ChargeDate": "2020-05-12T15:56:59.806+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2021-04-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-04-01",
                      "ChargeDate": "2020-05-12T15:56:59.810+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2021-04-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-04-01",
                      "ChargeDate": "2020-05-12T15:56:59.812+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2021-04-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-04-01",
                      "ChargeDate": "2020-05-12T15:56:59.818+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2021-03-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-03-01",
                      "ChargeDate": "2020-05-12T15:56:59.800+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2021-03-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-03-01",
                      "ChargeDate": "2020-05-12T15:56:59.802+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2021-03-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-03-01",
                      "ChargeDate": "2020-05-12T15:56:59.803+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2021-03-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-03-01",
                      "ChargeDate": "2020-05-12T15:56:59.807+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2021-03-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-03-01",
                      "ChargeDate": "2020-05-12T15:56:59.811+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2021-03-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-03-01",
                      "ChargeDate": "2020-05-12T15:56:59.812+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2021-03-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-03-01",
                      "ChargeDate": "2020-05-12T15:56:59.817+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2021-02-28",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-02-01",
                      "ChargeDate": "2020-05-12T15:56:59.802+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2021-02-28",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-02-01",
                      "ChargeDate": "2020-05-12T15:56:59.803+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2021-02-28",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-02-01",
                      "ChargeDate": "2020-05-12T15:56:59.804+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2021-02-28",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-02-01",
                      "ChargeDate": "2020-05-12T15:56:59.804+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2021-02-28",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-02-01",
                      "ChargeDate": "2020-05-12T15:56:59.811+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2021-02-28",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-02-01",
                      "ChargeDate": "2020-05-12T15:56:59.813+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2021-02-28",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-02-01",
                      "ChargeDate": "2020-05-12T15:56:59.820+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2021-01-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-01-01",
                      "ChargeDate": "2020-05-12T15:56:59.797+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2021-01-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-01-01",
                      "ChargeDate": "2020-05-12T15:56:59.803+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2021-01-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-01-01",
                      "ChargeDate": "2020-05-12T15:56:59.804+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2021-01-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-01-01",
                      "ChargeDate": "2020-05-12T15:56:59.809+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2021-01-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-01-01",
                      "ChargeDate": "2020-05-12T15:56:59.815+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2021-01-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-01-01",
                      "ChargeDate": "2020-05-12T15:56:59.819+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2021-01-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2021-01-01",
                      "ChargeDate": "2020-05-12T15:56:59.820+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2020-12-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-12-01",
                      "ChargeDate": "2020-05-12T15:56:59.798+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2020-12-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-12-01",
                      "ChargeDate": "2020-05-12T15:56:59.802+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2020-12-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-12-01",
                      "ChargeDate": "2020-05-12T15:56:59.807+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2020-12-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-12-01",
                      "ChargeDate": "2020-05-12T15:56:59.808+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2020-12-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-12-01",
                      "ChargeDate": "2020-05-12T15:56:59.811+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2020-12-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-12-01",
                      "ChargeDate": "2020-05-12T15:56:59.816+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2020-12-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-12-01",
                      "ChargeDate": "2020-05-12T15:56:59.817+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2020-11-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-11-01",
                      "ChargeDate": "2020-05-12T15:56:59.796+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2020-11-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-11-01",
                      "ChargeDate": "2020-05-12T15:56:59.804+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2020-11-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-11-01",
                      "ChargeDate": "2020-05-12T15:56:59.806+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2020-11-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-11-01",
                      "ChargeDate": "2020-05-12T15:56:59.808+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2020-11-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-11-01",
                      "ChargeDate": "2020-05-12T15:56:59.810+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2020-11-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-11-01",
                      "ChargeDate": "2020-05-12T15:56:59.816+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2020-11-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-11-01",
                      "ChargeDate": "2020-05-12T15:56:59.818+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2020-10-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-10-01",
                      "ChargeDate": "2020-05-12T15:56:59.799+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2020-10-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-10-01",
                      "ChargeDate": "2020-05-12T15:56:59.806+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2020-10-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-10-01",
                      "ChargeDate": "2020-05-12T15:56:59.810+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2020-10-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-10-01",
                      "ChargeDate": "2020-05-12T15:56:59.814+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2020-10-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-10-01",
                      "ChargeDate": "2020-05-12T15:56:59.816+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2020-10-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-10-01",
                      "ChargeDate": "2020-05-12T15:56:59.817+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2020-10-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-10-01",
                      "ChargeDate": "2020-05-12T15:56:59.817+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2020-09-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-09-01",
                      "ChargeDate": "2020-05-12T15:56:59.797+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2020-09-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-09-01",
                      "ChargeDate": "2020-05-12T15:56:59.805+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2020-09-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-09-01",
                      "ChargeDate": "2020-05-12T15:56:59.809+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2020-09-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-09-01",
                      "ChargeDate": "2020-05-12T15:56:59.813+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2020-09-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-09-01",
                      "ChargeDate": "2020-05-12T15:56:59.814+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2020-09-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-09-01",
                      "ChargeDate": "2020-05-12T15:56:59.818+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2020-09-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-09-01",
                      "ChargeDate": "2020-05-12T15:56:59.819+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2020-08-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-08-01",
                      "ChargeDate": "2020-05-12T15:56:59.795+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2020-08-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-08-01",
                      "ChargeDate": "2020-05-12T15:56:59.801+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2020-08-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-08-01",
                      "ChargeDate": "2020-05-12T15:56:59.809+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2020-08-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-08-01",
                      "ChargeDate": "2020-05-12T15:56:59.814+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2020-08-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-08-01",
                      "ChargeDate": "2020-05-12T15:56:59.814+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2020-08-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-08-01",
                      "ChargeDate": "2020-05-12T15:56:59.819+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2020-08-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-08-01",
                      "ChargeDate": "2020-05-12T15:56:59.820+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2020-07-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-07-01",
                      "ChargeDate": "2020-05-12T15:56:59.797+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2020-07-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-07-01",
                      "ChargeDate": "2020-05-12T15:56:59.801+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2020-07-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-07-01",
                      "ChargeDate": "2020-05-12T15:56:59.802+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2020-07-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-07-01",
                      "ChargeDate": "2020-05-12T15:56:59.805+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2020-07-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-07-01",
                      "ChargeDate": "2020-05-12T15:56:59.806+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2020-07-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-07-01",
                      "ChargeDate": "2020-05-12T15:56:59.815+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2020-07-31",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-07-01",
                      "ChargeDate": "2020-05-12T15:56:59.819+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a79e40fc",
                      "ServiceEndDate": "2020-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Wednesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.797+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a76e40f4",
                      "ServiceEndDate": "2020-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Thursday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.801+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a74440ec",
                      "ServiceEndDate": "2020-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.75,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Saturday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.805+01:00",
                      "ChargeAmount": 9.75,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a71b40e4",
                      "ServiceEndDate": "2020-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Friday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.807+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7c44104",
                      "ServiceEndDate": "2020-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Tuesday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.808+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf10501556e84a7eb410c",
                      "ServiceEndDate": "2020-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 6.7,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Monday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.813+01:00",
                      "ChargeAmount": 6.7,
                      "Quantity": 1
                  },
                  {
                      "ProductRatePlanChargeId": "2c92c0f9555cf11d01556e851a1c0cb0",
                      "ServiceEndDate": "2020-06-30",
                      "TaxExemptAmount": 0,
                      "UnitPrice": 9.74,
                      "ProductId": "2c92c0f8555ce5cf01556e7f01281b7e",
                      "ChargeName": "Sunday",
                      "TaxAmount": 0,
                      "ServiceStartDate": "2020-06-01",
                      "ChargeDate": "2020-05-12T15:56:59.820+01:00",
                      "ChargeAmount": 9.74,
                      "Quantity": 1
                  }
              ]
          }
      ],
      "TotalTcv": 1237.572903243,
      "TotalMrr": 52.99
  }
  """
}
