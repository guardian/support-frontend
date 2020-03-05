package com.gu.support.workers

import java.io.ByteArrayInputStream
import java.util.UUID

import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Fixtures.{emailAddress, idId}
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import io.circe.syntax._
import org.joda.time.{DateTimeZone, LocalDate}

//noinspection TypeAnnotation
object JsonFixtures {

  def wrapFixture(string: String): ByteArrayInputStream =
    JsonWrapper(string, None, RequestInfo(testUser = false, failed = false, Nil, accountExists = false))
      .asJson.noSpaces.asInputStream

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
          "allowMembershipMail": false,
          "allowThirdPartyMail": false,
          "allowGURelatedMail": false,
          "isTestUser": false,
          "deliveryInstructions": "Leave with neighbour"
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
          "allowMembershipMail": false,
          "allowThirdPartyMail": false,
          "allowGURelatedMail": false,
          "isTestUser": false,
          "deliveryInstructions": "Leave with neighbour"
        }
    """

  val userJsonWithDeliveryAddress =
    s"""
      "user":{
          "id": "$idId",
          "primaryEmailAddress": "$emailAddress",
          "firstName": "test",
          "lastName": "user",
          "country": "GB",
          "billingAddress": {
            "country": "GB",
            "lineOne": "yaw kroy 09",
            "city": "london",
            "postCode": "n1 9gu"
          },
          "deliveryAddress": {
            "country": "GB",
            "lineOne": "90 york way",
            "city": "london",
            "postCode": "n1 9gu"
          },
          "allowMembershipMail": false,
          "allowThirdPartyMail": false,
          "allowGURelatedMail": false,
          "isTestUser": false,
          "deliveryInstructions": "Leave with neighbour"
        }
    """
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
              "paymentGateway": "PayPal Express"
         }
       """

  val stripePaymentMethod = // test env card and cus token, not prod ones
    s"""
        {
           "TokenId": "card_E0zitFfsO2wTEn",
           "SecondTokenId": "cus_E0zic0cedDT5MZ",
           "CreditCardNumber": "4242",
           "CreditCardCountry": "US",
           "CreditCardExpirationMonth": 2,
           "CreditCardExpirationYear": 2022,
           "CreditCardType": "Visa",
           "Type": "CreditCardReferenceTransaction",
           "paymentGateway": "Stripe Gateway 1"
         }
       """

  def contribution(amount: BigDecimal = 5, currency: Currency = GBP, billingPeriod: BillingPeriod = Monthly): String =
    s"""
      {
        "amount": $amount,
        "currency": "$currency",
        "billingPeriod": "$billingPeriod"
      }
    """

  val digitalPackJson =
    """
      {
        "currency": "GBP",
        "billingPeriod" : "Annual"
      }
    """

  val everydayPaperJson =
    """
      {
        "currency": "GBP",
        "billingPeriod" : "Monthly",
        "fulfilmentOptions" : "HomeDelivery",
        "productOptions" : "Everyday"
      }
    """

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
          "campaignCode":null,
          "referrerPageviewId":null,
          "referrerUrl":null,
          "componentId":null,
          "componentType":null,
          "source":null,
          "abTests":[{
            "name":"fakeTest",
            "variant":"fakeVariant"
          }],
          "queryParameters":null,
          "hostname":"support.thegulocal.com"
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
          "paymentFields": $payPalJson,
          "acquisitionData": $acquisitionData
        }"""

  def createStripeSourcePaymentMethodContributionJson(billingPeriod: BillingPeriod = Monthly, amount: BigDecimal = 5, currency: Currency = GBP): String =
    s"""{
          $requestIdJson,
          ${userJson()},
          "product": ${contribution(amount = amount, billingPeriod = billingPeriod, currency = currency)},
          "paymentFields": $stripeJson,
          "sessionId": "testingToken",
          "acquisitionData": $acquisitionData
        }"""

  def createStripePaymentMethodPaymentMethodContributionJson(billingPeriod: BillingPeriod = Monthly, amount: BigDecimal = 5, currency: Currency = GBP): String =
    s"""{
          $requestIdJson,
          ${userJson()},
          "product": ${contribution(amount = amount, billingPeriod = billingPeriod, currency = currency)},
          "paymentFields": $stripePaymentMethodJson,
          "sessionId": "testingToken",
          "acquisitionData": $acquisitionData
        }"""

  val createPayPalPaymentMethodDigitalPackJson =
    s"""{
          $requestIdJson,
          ${userJson()},
          $digitalPackProductJson,
          "paymentFields": $payPalJson
        }"""

  val createDirectDebitDigitalPackJson =
    s"""{
          $requestIdJson,
          ${userJson()},
          $digitalPackProductJson,
          "paymentFields": $directDebitJson
        }"""

  val createSalesForceContactJson =
    s"""
          {
            $requestIdJson,
            ${userJson(	"200001969")},
            "product": ${contribution()},
            "paymentMethod": $payPalPaymentMethod
          }
        """

  val createSalesForceGiftContactJson =
    s"""
          {
            $requestIdJson,
            ${userJson()},
            "product": ${contribution()},
            "paymentMethod": $payPalPaymentMethod,
            "giftRecipient": {
              "title": "Mr",
              "firstName": "Gifty",
              "lastName": "McRecipent",
              "email": "gift.recipient@gu.com"
            }
          }
        """

  def thankYouEmailJson(product: String = contribution()): String =
    s"""{
       |  $requestIdJson,
       |  ${userJson()},
       |  "product": $product,
       |  "paymentMethod": $stripePaymentMethod,
       |  "salesForceContact": {
       |    "Id": "sfContactId123",
       |    "AccountId": "sfAccountId321"
       |  },
       |  "accountNumber": "A-00123",
       |  "subscriptionNumber": "A-S12345678",
       |  "paymentSchedule": {
       |    "payments": [
       |      {
       |        "date": "2019-01-14",
       |        "amount": 11.99
       |      },
       |      {
       |        "date": "2019-02-14",
       |        "amount": 11.99
       |      },
       |      {
       |        "date": "2019-03-14",
       |        "amount": 11.99
       |      }
       |    ]
       |  }
       |}
     """.stripMargin

  val salesforceContactJson =
    """
        {
          "Id": "003g000001UnFItAAN",
          "AccountId": "001g000001gOR06AAG"
        }
      """

  val salesforceContactsJson =
    """
       "salesforceContacts": {
          "buyer": {
            "Id": "003g000001UnFItAAN",
            "AccountId": "001g000001gOR06AAG"
          },
          "giftRecipient": {
            "Id": "003g000001UnFItAAN",
            "AccountId": "001g000001gOR06AAG"
          }
        }
      """

  def createContributionZuoraSubscriptionJson(billingPeriod: BillingPeriod = Monthly): String =
    s"""
          {
            $requestIdJson,
            ${userJson()},
            "product": ${contribution(billingPeriod = billingPeriod)},
            "paymentMethod": $stripePaymentMethod,
            "salesForceContact": $salesforceContactJson,
            $salesforceContactsJson
            }
        """
  val createDigiPackZuoraSubscriptionJson =
    s"""
          {
            $requestIdJson,
            ${userJson()},
            "product": $digitalPackJson,
            "paymentMethod": $stripePaymentMethod,
            "salesForceContact": $salesforceContactJson,
            $salesforceContactsJson
            }
        """

  val createDigiPackSubscriptionWithPromoJson =
    s"""
          {
            $requestIdJson,
            ${userJson()},
            "product": $digitalPackJson,
            "paymentMethod": $stripePaymentMethod,
            "promoCode": "DJP8L27FY",
            "salesForceContact": $salesforceContactJson,
            $salesforceContactsJson
            }
        """

  val createEverydayPaperSubscriptionJson =
    s"""
          {
            $requestIdJson,
            $userJsonWithDeliveryAddress,
            "product": $everydayPaperJson,
            "firstDeliveryDate": "${LocalDate.now(DateTimeZone.UTC)}",
            "paymentMethod": $stripePaymentMethod,
            "salesForceContact": $salesforceContactJson,
            $salesforceContactsJson
            }
      """

  def createGuardianWeeklySubscriptionJson(billingPeriod: BillingPeriod, maybePromoCode: Option[PromoCode] = None): String ={
    val promoJson = maybePromoCode.map(promo => s""""promoCode": "$promo",""").getOrElse("")
    s"""
      {
        $requestIdJson,
        $userJsonWithDeliveryAddress,
        "product": {
          "currency": "GBP",
          "billingPeriod" : "$billingPeriod",
          "fulfilmentOptions" : "RestOfWorld"
        },
        "firstDeliveryDate": "${LocalDate.now(DateTimeZone.UTC).plusDays(10)}",
        $promoJson
        "paymentMethod": $stripePaymentMethod,
        "salesForceContact": $salesforceContactJson,
        $salesforceContactsJson
        }
      """
    }

  val guardianWeeklyGiftJson =
    s"""
      {
        $requestIdJson,
        $userJsonWithDeliveryAddress,
        "giftRecipient": {
          "title": "Mr",
          "firstName": "Harry",
          "lastName": "Ramsden"
        },
        "product": {
          "currency": "GBP",
          "billingPeriod" : "Quarterly",
          "fulfilmentOptions" : "RestOfWorld"
        },
        "firstDeliveryDate": "${LocalDate.now(DateTimeZone.UTC).plusDays(10)}",
        "paymentMethod": $stripePaymentMethod,
        "salesForceContact": $salesforceContactJson,
        $salesforceContactsJson
        }
      """

  val failureJson =
    """{
          "state": "{\"requestId\":\"e18f6418-45f2-11e7-8bfa-8faac2182601\",\"user\":{\"id\":\"12345\",\"primaryEmailAddress\":\"test@gu.com\",\"firstName\":\"test\",\"lastName\":\"user\",\"country\":\"GB\",\"billingAddress\":{\"country\":\"GB\"},\"allowMembershipMail\":false,\"allowThirdPartyMail\":false,\"allowGURelatedMail\":false,\"isTestUser\":false},\"product\":{\"amount\":5,\"currency\":\"GBP\",\"billingPeriod\":\"Annual\"},\"paymentMethod\":{\"TokenId\":\"card_E0zitFfsO2wTEn\",\"SecondTokenId\":\"cus_E0zic0cedDT5MZ\",\"CreditCardNumber\":\"4242\",\"CreditCardCountry\":\"US\",\"CreditCardExpirationMonth\":2,\"CreditCardExpirationYear\":2022,\"CreditCardType\":\"Visa\",\"Type\":\"CreditCardReferenceTransaction\",\"paymentGateway\":\"Stripe Gateway 1\"},\"salesForceContact\":{\"Id\":\"003g000001UnFItAAN\",\"AccountId\":\"001g000001gOR06AAG\"},\"salesforceContacts\":{\"buyer\":{\"Id\":\"003g000001UnFItAAN\",\"AccountId\":\"001g000001gOR06AAG\"},\"giftRecipient\":{\"Id\":\"003g000001UnFItAAN\",\"AccountId\":\"001g000001gOR06AAG\"}}}",
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

  //This Json uses a test Stripe token which causes Stripe to return a card_declined response, but the product is a digital pack
  val digipackCardDeclinedStripeJson =
    """
    {
      "state": "{\"requestId\":\"299f0204-8f82-f479-0000-00000000e33d\",\"user\":{\"id\":\"30001643\",\"primaryEmailAddress\":\"test@gu.com\",\"firstName\":\"FygxilMxB5QMoAkmuIc\",\"lastName\":\"FygxilMxB5QMoAkmuIc\",\"billingAddress\":{\"country\":\"GB\"},\"country\":\"GB\",\"state\":null,\"allowMembershipMail\":false,\"allowThirdPartyMail\":false,\"allowGURelatedMail\":false,\"isTestUser\":false},\"product\":{\"currency\":\"GBP\",\"billingPeriod\":\"Annual\"},\"paymentFields\":{\"userId\":\"30001643\",\"stripeToken\":\"tok_chargeDeclined\"},\"acquisitionData\":{\"ophanIds\":{\"pageviewId\":\"jaignx8mlwazhhpaq9tk\",\"visitId\":null,\"browserId\":null},\"referrerAcquisitionData\":{\"campaignCode\":null,\"referrerPageviewId\":null,\"referrerUrl\":null,\"componentId\":null,\"componentType\":null,\"source\":null,\"abTest\":null},\"supportAbTests\":[{\"name\":\"usRecurringCopyTest\",\"variant\":\"notintest\"},{\"name\":\"ukRecurringAmountsTest\",\"variant\":\"lower\"},{\"name\":\"usRecurringAmountsTest\",\"variant\":\"notintest\"}]}}",
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
        "state": "{\"requestId\":\"e18f6418-45f2-11e7-8bfa-8faac2182601\",\"user\":{\"id\":\"12345\",\"primaryEmailAddress\":\"test@gu.com\",\"firstName\":\"test\",\"lastName\":\"user\",\"country\":\"GB\",\"billingAddress\":{\"country\":\"GB\"},\"allowMembershipMail\":false,\"allowThirdPartyMail\":false,\"allowGURelatedMail\":false,\"isTestUser\":false},\"product\":{\"amount\":5,\"currency\":\"GBP\",\"billingPeriod\":\"Annual\"},\"paymentMethod\":{\"TokenId\":\"card_E0zitFfsO2wTEn\",\"SecondTokenId\":\"cus_E0zic0cedDT5MZ\",\"CreditCardNumber\":\"4242\",\"CreditCardCountry\":\"US\",\"CreditCardExpirationMonth\":2,\"CreditCardExpirationYear\":2022,\"CreditCardType\":\"Visa\",\"Type\":\"CreditCardReferenceTransaction\",\"paymentGateway\":\"Stripe Gateway 1\"},\"salesForceContact\":{\"Id\":\"003g000001UnFItAAN\",\"AccountId\":\"001g000001gOR06AAG\"},\"salesforceContacts\":{\"buyer\":{\"Id\":\"003g000001UnFItAAN\",\"AccountId\":\"001g000001gOR06AAG\"},\"giftRecipient\":{\"Id\":\"003g000001UnFItAAN\",\"AccountId\":\"001g000001gOR06AAG\"}}}",
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
        "state": "{\"requestId\":\"299f0204-8f82-f479-0000-00000000e33d\",\"user\":{\"id\":\"30001643\",\"primaryEmailAddress\":\"fygxilmxb5qmoakmuic@gu.com\",\"firstName\":\"FygxilMxB5QMoAkmuIc\",\"lastName\":\"FygxilMxB5QMoAkmuIc\",\"country\":\"GB\",\"billingAddress\":{\"country\":\"GB\"},\"state\":null,\"allowMembershipMail\":false,\"allowThirdPartyMail\":false,\"allowGURelatedMail\":false,\"isTestUser\":false},\"product\":{\"currency\":\"GBP\",\"billingPeriod\":\"Monthly\",\"amount\":5,\"type\":\"Contribution\"},\"paymentFields\":{\"userId\":\"30001643\",\"stripeToken\":\"tok_chargeDeclined\"},\"acquisitionData\":{\"ophanIds\":{\"pageviewId\":\"jaignx8mlwazhhpaq9tk\",\"visitId\":null,\"browserId\":null},\"referrerAcquisitionData\":{\"campaignCode\":null,\"referrerPageviewId\":null,\"referrerUrl\":null,\"componentId\":null,\"componentType\":null,\"source\":null,\"abTest\":null},\"supportAbTests\":[{\"name\":\"usRecurringCopyTest\",\"variant\":\"notintest\"},{\"name\":\"ukRecurringAmountsTest\",\"variant\":\"lower\"},{\"name\":\"usRecurringAmountsTest\",\"variant\":\"notintest\"}]}}",
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
        "state": "{\"requestId\":\"299f0204-8f82-f479-0000-00000000e33d\",\"user\":{\"id\":\"30001643\",\"primaryEmailAddress\":\"fygxilmxb5qmoakmuic@gu.com\",\"firstName\":\"FygxilMxB5QMoAkmuIc\",\"lastName\":\"FygxilMxB5QMoAkmuIc\",\"country\":\"GB\",\"billingAddress\":{\"country\":\"GB\"},\"state\":null,\"allowMembershipMail\":false,\"allowThirdPartyMail\":false,\"allowGURelatedMail\":false,\"isTestUser\":false},\"product\":{\"currency\":\"GBP\",\"billingPeriod\":\"Monthly\",\"amount\":5,\"type\":\"Contribution\"},\"paymentFields\":{\"userId\":\"30001643\",\"stripeToken\":\"tok_chargeDeclined\"},\"acquisitionData\":{\"ophanIds\":{\"pageviewId\":\"jaignx8mlwazhhpaq9tk\",\"visitId\":null,\"browserId\":null},\"referrerAcquisitionData\":{\"campaignCode\":null,\"referrerPageviewId\":null,\"referrerUrl\":null,\"componentId\":null,\"componentType\":null,\"source\":null,\"abTest\":null},\"supportAbTests\":[{\"name\":\"usRecurringCopyTest\",\"variant\":\"notintest\"},{\"name\":\"ukRecurringAmountsTest\",\"variant\":\"lower\"},{\"name\":\"usRecurringAmountsTest\",\"variant\":\"notintest\"}]}}",
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
        "state": "{\"requestId\":\"a64ad98e-5d39-4ffc-a4a9-217357dc2b19\",\"user\":{\"id\":\"9999999\",\"primaryEmailAddress\":\"integration-test@gu.com\",\"firstName\":\"test\",\"lastName\":\"user\",\"country\":\"GB\",\"billingAddress\":{\"country\":\"GB\"},\"allowMembershipMail\":false,\"allowThirdPartyMail\":false,\"allowGURelatedMail\":false,\"isTestUser\":false},\"product\":{\"amount\":5,\"currency\":\"GBP\",\"billingPeriod\":\"Monthly\"},\"paymentMethod\":{\"PaypalBaid\":\"B-23637766K5365543J\",\"PaypalEmail\":\"test@paypal.com\",\"PaypalType\":\"ExpressCheckout\",\"Type\":\"PayPal\",\"paymentGateway\":\"PayPal Express\"},\"giftRecipient\":{\"title\":\"Mr\",\"firstName\":\"Gifty\",\"lastName\":\"McRecipent\",\"email\":\"gift.recipient@gu.com\"}}",
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

  val sendAcquisitionEventJson = wrapFixture(
    s"""{
          $requestIdJson,
          ${userJson()},
          "product": ${contribution(currency = GBP)},
          "paymentMethod": $stripePaymentMethod,
          "acquisitionData": $acquisitionData
        }"""
  )

  val digipackSubscriptionWithDiscountAndFreeTrialJson =
    s"""
        {
          $requestIdJson,
          ${userJson()},
          "product": $digitalPackJson,
          "paymentMethod": $stripePaymentMethod,
          "promoCode": "DJRHYMDS8",
          "salesForceContact": {
              "Id": "0036E00000VlOPDQA3",
              "AccountId": "0016E00000f17pYQAQ"
          },
          "acquisitionData": $acquisitionData,
          $salesforceContactsJson
      }
      """

  def getPaymentMethodJson(billingAccountId: String, userId: String): String =
    s"""
          {
            $requestIdJson,
            ${userJson(userId)},
            "product": ${contribution()},
            "paymentFields" : {"billingAccountId" : "$billingAccountId"}
            }
        """


}
