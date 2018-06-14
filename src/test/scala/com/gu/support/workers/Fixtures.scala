package com.gu.support.workers

import java.io.ByteArrayInputStream

import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Fixtures.idId
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Wrapper
import com.gu.support.workers.model.{BillingPeriod, Monthly, RequestInfo}
import com.gu.zuora.encoding.CustomCodecs.jsonWrapperEncoder
import io.circe.syntax._

//noinspection TypeAnnotation
object Fixtures {
  val useEncryption = false

  def wrapFixture(string: String): ByteArrayInputStream =
    Wrapper.wrapString(string, RequestInfo(useEncryption, testUser = false, failed = false, Nil)).asJson.noSpaces.asInputStream

  val userJson =
    s"""
      "user":{
          "id": "$idId",
          "primaryEmailAddress": "test@gu.com",
          "firstName": "test",
          "lastName": "user",
          "country": "GB",
          "allowMembershipMail": false,
          "allowThirdPartyMail": false,
          "allowGURelatedMail": false,
          "isTestUser": false
        }
    """
  val requestIdJson = "\"requestId\": \"e18f6418-45f2-11e7-8bfa-8faac2182601\""
  val validBaid = "B-23637766K5365543J"
  val payPalEmail = "test@paypal.com"
  val payPalPaymentMethod =
    s"""
        {
              "PaypalBaid": "$validBaid",
              "PaypalEmail": "$payPalEmail",
              "PaypalType": "ExpressCheckout",
              "Type": "PayPal"
         }
       """

  def contribution(amount: BigDecimal = 5, currency: Currency = GBP, billingPeriod: BillingPeriod = Monthly) =
    s"""
      {
        "amount": $amount,
        "currency": "$currency",
        "billingPeriod": "$billingPeriod"
      }
    """

  val payPalJson =
    s"""
                {
                  "baid": "$validBaid"
                }
                """
  val stripeToken = "tok_AXY4M16p60c2sg"
  val stripeJson =
    s"""
                {
                  "stripeToken": "$stripeToken"
                }
                """

  def createPayPalPaymentMethodJson(currency: Currency = GBP) =
    s"""{
          $requestIdJson,
          $userJson,
          "contribution": ${contribution(currency = currency)},
          "paymentFields": $payPalJson
        }"""

  def createStripePaymentMethodJson(billingPeriod: BillingPeriod = Monthly, amount: BigDecimal = 5) =
    s"""{
          $requestIdJson,
          $userJson,
          "contribution": ${contribution(amount = amount, billingPeriod = billingPeriod)},
          "paymentFields": $stripeJson
        }"""

  val createSalesForceContactJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "contribution": ${contribution()},
            "paymentMethod": $payPalPaymentMethod
          }
        """

  val thankYouEmailJson =
    s"""{
       |  $requestIdJson,
       |  $userJson,
       |  "contribution": ${contribution()},
       |  "paymentMethod": $payPalPaymentMethod,
       |  "salesForceContact": {
       |    "Id": "123",
       |    "AccountId": "123"
       |  },
       |  "accountNumber": "123"
       |}
     """.stripMargin

  val salesforceContactJson =
    """
        {
          "Id": "003g000001UnFItAAN",
          "AccountId": "001g000001gOR06AAG"
        }
      """

  def createZuoraSubscriptionJson(billingPeriod: BillingPeriod = Monthly) =
    s"""
          {
            $requestIdJson,
            $userJson,
            "contribution": ${contribution(billingPeriod = billingPeriod)},
            "paymentMethod": $payPalPaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
        """

  val failureJson =
    """{
          "state": "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",
          "error": {
            "Error": "com.example.SomeError",
            "Cause": "Oh no! It's on fire!"
          },
          "requestInfo": {
            "encrypted": true,
            "testUser": false,
            "failed": false,
            "messages": []
          }
        }
     """

  //This Json uses a test Stripe token which causes Stripe to return a card_declined response
  val forceCardDeclined =
    """
      {
        "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDMiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZnlneGlsbXhiNXFtb2FrbXVpY0BndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiY291bnRyeSI6IkdCIiwic3RhdGUiOm51bGwsImFsbG93TWVtYmVyc2hpcE1haWwiOmZhbHNlLCJhbGxvd1RoaXJkUGFydHlNYWlsIjpmYWxzZSwiYWxsb3dHVVJlbGF0ZWRNYWlsIjpmYWxzZSwiaXNUZXN0VXNlciI6ZmFsc2V9LCJjb250cmlidXRpb24iOnsiYW1vdW50Ijo1LCJjdXJyZW5jeSI6IkdCUCIsImJpbGxpbmdQZXJpb2QiOiJNb250aGx5In0sInBheW1lbnRGaWVsZHMiOnsidXNlcklkIjoiMzAwMDE2NDMiLCJzdHJpcGVUb2tlbiI6InRva19jaGFyZ2VEZWNsaW5lZCJ9LCJhY3F1aXNpdGlvbkRhdGEiOnsib3BoYW5JZHMiOnsicGFnZXZpZXdJZCI6ImphaWdueDhtbHdhemhocGFxOXRrIiwidmlzaXRJZCI6bnVsbCwiYnJvd3NlcklkIjpudWxsfSwicmVmZXJyZXJBY3F1aXNpdGlvbkRhdGEiOnsiY2FtcGFpZ25Db2RlIjpudWxsLCJyZWZlcnJlclBhZ2V2aWV3SWQiOm51bGwsInJlZmVycmVyVXJsIjpudWxsLCJjb21wb25lbnRJZCI6bnVsbCwiY29tcG9uZW50VHlwZSI6bnVsbCwic291cmNlIjpudWxsLCJhYlRlc3QiOm51bGx9LCJzdXBwb3J0QWJUZXN0cyI6W3sibmFtZSI6InVzUmVjdXJyaW5nQ29weVRlc3QiLCJ2YXJpYW50Ijoibm90aW50ZXN0In0seyJuYW1lIjoidWtSZWN1cnJpbmdBbW91bnRzVGVzdCIsInZhcmlhbnQiOiJsb3dlciJ9LHsibmFtZSI6InVzUmVjdXJyaW5nQW1vdW50c1Rlc3QiLCJ2YXJpYW50Ijoibm90aW50ZXN0In1dfX0=",
        "error": null,
        "requestInfo": {
          "encrypted": false,
          "testUser": true,
          "failed": false,
          "messages": []
        }
      }
    """

  //This Json uses a test Stripe token which fails when Zuora tries to charge it
  val forceZuoraCardDeclined =
    """
      {
        "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDQiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZnlneGlsbXhiNXFtb2FrbXVpY0BndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiY291bnRyeSI6IkdCIiwic3RhdGUiOm51bGwsImFsbG93TWVtYmVyc2hpcE1haWwiOmZhbHNlLCJhbGxvd1RoaXJkUGFydHlNYWlsIjpmYWxzZSwiYWxsb3dHVVJlbGF0ZWRNYWlsIjpmYWxzZSwiaXNUZXN0VXNlciI6ZmFsc2V9LCJjb250cmlidXRpb24iOnsiYW1vdW50Ijo1LCJjdXJyZW5jeSI6IkdCUCIsImJpbGxpbmdQZXJpb2QiOiJNb250aGx5In0sInBheW1lbnRGaWVsZHMiOnsidXNlcklkIjoiMzAwMDE2NDMiLCJzdHJpcGVUb2tlbiI6InRva19jaGFyZ2VDdXN0b21lckZhaWwifSwiYWNxdWlzaXRpb25EYXRhIjp7Im9waGFuSWRzIjp7InBhZ2V2aWV3SWQiOiJqYWlnbng4bWx3YXpoaHBhcTl0ayIsInZpc2l0SWQiOm51bGwsImJyb3dzZXJJZCI6bnVsbH0sInJlZmVycmVyQWNxdWlzaXRpb25EYXRhIjp7ImNhbXBhaWduQ29kZSI6bnVsbCwicmVmZXJyZXJQYWdldmlld0lkIjpudWxsLCJyZWZlcnJlclVybCI6bnVsbCwiY29tcG9uZW50SWQiOm51bGwsImNvbXBvbmVudFR5cGUiOm51bGwsInNvdXJjZSI6bnVsbCwiYWJUZXN0IjpudWxsfSwic3VwcG9ydEFiVGVzdHMiOlt7Im5hbWUiOiJ1c1JlY3VycmluZ0NvcHlUZXN0IiwidmFyaWFudCI6Im5vdGludGVzdCJ9LHsibmFtZSI6InVrUmVjdXJyaW5nQW1vdW50c1Rlc3QiLCJ2YXJpYW50IjoibG93ZXIifSx7Im5hbWUiOiJ1c1JlY3VycmluZ0Ftb3VudHNUZXN0IiwidmFyaWFudCI6Im5vdGludGVzdCJ9XX19",
        "error": null,
        "requestInfo": {
          "encrypted": false,
          "testUser": true,
          "failed": false,
          "messages": []
        }
      }
    """

  val zuoraErrorResponse =
    """[{"Code": "TRANSACTION_FAILED","Message": "Transaction declined.do_not_honor - Your card was declined."}]"""

  val cardDeclinedJsonZuora =
    """
      {
        "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDQiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZnlneGlsbXhiNXFtb2FrbXVpY0BndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiY291bnRyeSI6IkdCIiwic3RhdGUiOm51bGwsImFsbG93TWVtYmVyc2hpcE1haWwiOmZhbHNlLCJhbGxvd1RoaXJkUGFydHlNYWlsIjpmYWxzZSwiYWxsb3dHVVJlbGF0ZWRNYWlsIjpmYWxzZSwiaXNUZXN0VXNlciI6ZmFsc2V9LCJjb250cmlidXRpb24iOnsiYW1vdW50Ijo1LCJjdXJyZW5jeSI6IkdCUCIsImJpbGxpbmdQZXJpb2QiOiJNb250aGx5In0sInBheW1lbnRNZXRob2QiOnsiVG9rZW5JZCI6ImNhcmRfQnF1eWozRlZWUzhienQiLCJTZWNvbmRUb2tlbklkIjoiY3VzX0JxdXlJdjA2YWlOOTJlIiwiQ3JlZGl0Q2FyZE51bWJlciI6IjAzNDEiLCJDcmVkaXRDYXJkQ291bnRyeSI6IlVTIiwiQ3JlZGl0Q2FyZEV4cGlyYXRpb25Nb250aCI6OCwiQ3JlZGl0Q2FyZEV4cGlyYXRpb25ZZWFyIjoyMDE5LCJDcmVkaXRDYXJkVHlwZSI6IlZpc2EiLCJUeXBlIjoiQ3JlZGl0Q2FyZFJlZmVyZW5jZVRyYW5zYWN0aW9uIn0sInNhbGVzRm9yY2VDb250YWN0Ijp7IklkIjoiMDAzZzAwMDAwMWNVeWkxQUFDIiwiQWNjb3VudElkIjoiMDAxZzAwMDAwMW5Ic3BkQUFDIn0sImFjcXVpc2l0aW9uRGF0YSI6eyJvcGhhbklkcyI6eyJwYWdldmlld0lkIjoiamFpZ254OG1sd2F6aGhwYXE5dGsiLCJ2aXNpdElkIjpudWxsLCJicm93c2VySWQiOm51bGx9LCJyZWZlcnJlckFjcXVpc2l0aW9uRGF0YSI6eyJjYW1wYWlnbkNvZGUiOm51bGwsInJlZmVycmVyUGFnZXZpZXdJZCI6bnVsbCwicmVmZXJyZXJVcmwiOm51bGwsImNvbXBvbmVudElkIjpudWxsLCJjb21wb25lbnRUeXBlIjpudWxsLCJzb3VyY2UiOm51bGwsImFiVGVzdCI6bnVsbH0sInN1cHBvcnRBYlRlc3RzIjpbeyJuYW1lIjoidXNSZWN1cnJpbmdDb3B5VGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifSx7Im5hbWUiOiJ1a1JlY3VycmluZ0Ftb3VudHNUZXN0IiwidmFyaWFudCI6Imxvd2VyIn0seyJuYW1lIjoidXNSZWN1cnJpbmdBbW91bnRzVGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifV19fQ==",
        "error": {
          "Error": "com.gu.support.workers.exceptions.RetryNone",
          "Cause": "{\"errorMessage\":\"{\\n  \\\"Success\\\" : false,\\n  \\\"Errors\\\" : [\\n    {\\n      \\\"Code\\\" : \\\"TRANSACTION_FAILED\\\",\\n      \\\"Message\\\" : \\\"Transaction declined.generic_decline - Your card was declined.\\\"\\n    }\\n  ]\\n}\",\"errorType\":\"com.gu.support.workers.exceptions.RetryNone\",\"stackTrace\":[\"com.gu.zuora.model.response.ZuoraErrorResponse.asRetryException(Responses.scala:37)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:26)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:18)\",\"scala.runtime.AbstractPartialFunction.apply(AbstractPartialFunction.scala:36)\",\"com.gu.support.workers.lambdas.Handler.handleRequest(Handler.scala:30)\",\"sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\",\"sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\",\"sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\",\"java.lang.reflect.Method.invoke(Method.java:498)\"],\"cause\":{\"errorMessage\":\"[\\n  {\\n    \\\"Code\\\" : \\\"TRANSACTION_FAILED\\\",\\n    \\\"Message\\\" : \\\"Transaction declined.generic_decline - Your card was declined.\\\"\\n  }\\n]\",\"errorType\":\"com.gu.zuora.model.response.ZuoraErrorResponse\",\"stackTrace\":[\"com.gu.zuora.model.response.ZuoraErrorResponse$anon$lazy$macro$1415$1$anon$macro$1411$1.from(Responses.scala:21)\",\"com.gu.zuora.model.response.ZuoraErrorResponse$anon$lazy$macro$1415$1$anon$macro$1411$1.from(Responses.scala:21)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:229)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:226)\",\"io.circe.generic.decoding.DerivedDecoder$$anon$1.apply(DerivedDecoder.scala:14)\",\"io.circe.Decoder$class.tryDecode(Decoder.scala:33)\",\"io.circe.generic.decoding.DerivedDecoder.tryDecode(DerivedDecoder.scala:6)\",\"io.circe.Decoder$$anon$20.tryDecode(Decoder.scala:178)\",\"io.circe.Decoder$$anon$20.apply(Decoder.scala:177)\",\"com.gu.support.workers.encoding.Codec.apply(Codec.scala:9)\",\"io.circe.SeqDecoder.apply(SeqDecoder.scala:18)\",\"io.circe.Decoder$$anon$16.apply(Decoder.scala:111)\",\"io.circe.Decoder$class.decodeJson(Decoder.scala:49)\",\"io.circe.Decoder$$anon$16.decodeJson(Decoder.scala:110)\",\"io.circe.Parser$class.finishDecode(Parser.scala:11)\",\"io.circe.parser.package$.finishDecode(package.scala:5)\",\"io.circe.Parser$class.decode(Parser.scala:25)\",\"io.circe.parser.package$.decode(package.scala:5)\",\"com.gu.zuora.ZuoraService.decodeError(ZuoraService.scala:52)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:59)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:54)\",\"scala.util.Success$$anonfun$map$1.apply(Try.scala:237)\",\"scala.util.Try$.apply(Try.scala:192)\",\"scala.util.Success.map(Try.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.impl.CallbackRunnable.run(Promise.scala:32)\",\"scala.concurrent.impl.ExecutionContextImpl$AdaptedForkJoinTask.exec(ExecutionContextImpl.scala:121)\",\"scala.concurrent.forkjoin.ForkJoinTask.doExec(ForkJoinTask.java:260)\",\"scala.concurrent.forkjoin.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1339)\",\"scala.concurrent.forkjoin.ForkJoinPool.runWorker(ForkJoinPool.java:1979)\",\"scala.concurrent.forkjoin.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:107)\"]}}"
        },
        "requestInfo": {
          "encrypted": false,
          "testUser": true,
          "failed": false,
          "messages": []
        }
      }
     """
  val cardDeclinedJsonStripe =
    """
      {
        "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDMiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZnlneGlsbXhiNXFtb2FrbXVpY0BndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiY291bnRyeSI6IkdCIiwic3RhdGUiOm51bGwsImFsbG93TWVtYmVyc2hpcE1haWwiOmZhbHNlLCJhbGxvd1RoaXJkUGFydHlNYWlsIjpmYWxzZSwiYWxsb3dHVVJlbGF0ZWRNYWlsIjpmYWxzZSwiaXNUZXN0VXNlciI6ZmFsc2V9LCJjb250cmlidXRpb24iOnsiYW1vdW50Ijo1LCJjdXJyZW5jeSI6IkdCUCIsImJpbGxpbmdQZXJpb2QiOiJNb250aGx5In0sInBheW1lbnRGaWVsZHMiOnsidXNlcklkIjoiMzAwMDE2NDMiLCJzdHJpcGVUb2tlbiI6InRva19jaGFyZ2VEZWNsaW5lZCJ9LCJhY3F1aXNpdGlvbkRhdGEiOnsib3BoYW5JZHMiOnsicGFnZXZpZXdJZCI6ImphaWdueDhtbHdhemhocGFxOXRrIiwidmlzaXRJZCI6bnVsbCwiYnJvd3NlcklkIjpudWxsfSwicmVmZXJyZXJBY3F1aXNpdGlvbkRhdGEiOnsiY2FtcGFpZ25Db2RlIjpudWxsLCJyZWZlcnJlclBhZ2V2aWV3SWQiOm51bGwsInJlZmVycmVyVXJsIjpudWxsLCJjb21wb25lbnRJZCI6bnVsbCwiY29tcG9uZW50VHlwZSI6bnVsbCwic291cmNlIjpudWxsLCJhYlRlc3QiOm51bGx9LCJzdXBwb3J0QWJUZXN0cyI6W3sibmFtZSI6InVzUmVjdXJyaW5nQ29weVRlc3QiLCJ2YXJpYW50Ijoibm90aW50ZXN0In0seyJuYW1lIjoidWtSZWN1cnJpbmdBbW91bnRzVGVzdCIsInZhcmlhbnQiOiJsb3dlciJ9LHsibmFtZSI6InVzUmVjdXJyaW5nQW1vdW50c1Rlc3QiLCJ2YXJpYW50Ijoibm90aW50ZXN0In1dfX0=",
        "error": {
          "Error": "com.gu.support.workers.exceptions.RetryNone",
          "Cause": "{\"errorMessage\":\"{\\n  \\\"error\\\" : {\\n    \\\"type\\\" : \\\"card_error\\\",\\n    \\\"message\\\" : \\\"Your card was declined.\\\",\\n    \\\"code\\\" : \\\"card_declined\\\",\\n    \\\"decline_code\\\" : \\\"generic_decline\\\",\\n    \\\"param\\\" : \\\"\\\"\\n  }\\n}\",\"errorType\":\"com.gu.support.workers.exceptions.RetryNone\",\"stackTrace\":[\"com.gu.stripe.Stripe$StripeError.asRetryException(Stripe.scala:37)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:20)\",\"com.gu.support.workers.exceptions.ErrorHandler$$anonfun$1.applyOrElse(ErrorHandler.scala:18)\",\"scala.runtime.AbstractPartialFunction.apply(AbstractPartialFunction.scala:36)\",\"com.gu.support.workers.lambdas.Handler.handleRequest(Handler.scala:30)\",\"sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\",\"sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\",\"sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\",\"java.lang.reflect.Method.invoke(Method.java:498)\"],\"cause\":{\"errorMessage\":\"message: Your card was declined.; type: card_error; code: card_declined; decline_code: generic_decline; param: \",\"errorType\":\"com.gu.stripe.Stripe$StripeError\",\"stackTrace\":[\"com.gu.stripe.Stripe$StripeError$anon$lazy$macro$308$1$anon$macro$304$1.from(Stripe.scala:17)\",\"com.gu.stripe.Stripe$StripeError$anon$lazy$macro$308$1$anon$macro$304$1.from(Stripe.scala:17)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:229)\",\"shapeless.LabelledGeneric$$anon$1.from(generic.scala:226)\",\"io.circe.generic.decoding.DerivedDecoder$$anon$1.apply(DerivedDecoder.scala:14)\",\"io.circe.Decoder$class.tryDecode(Decoder.scala:33)\",\"io.circe.generic.decoding.DerivedDecoder.tryDecode(DerivedDecoder.scala:6)\",\"io.circe.Decoder$$anon$20.tryDecode(Decoder.scala:178)\",\"io.circe.Decoder$$anon$20.apply(Decoder.scala:177)\",\"com.gu.support.workers.encoding.Codec.apply(Codec.scala:9)\",\"io.circe.Decoder$class.decodeJson(Decoder.scala:49)\",\"com.gu.support.workers.encoding.Codec.decodeJson(Codec.scala:6)\",\"io.circe.Parser$class.finishDecode(Parser.scala:11)\",\"io.circe.parser.package$.finishDecode(package.scala:5)\",\"io.circe.Parser$class.decode(Parser.scala:25)\",\"io.circe.parser.package$.decode(package.scala:5)\",\"com.gu.helpers.WebServiceHelper$class.decodeError(WebServiceHelper.scala:73)\",\"com.gu.stripe.StripeService.decodeError(StripeService.scala:11)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:59)\",\"com.gu.helpers.WebServiceHelper$$anonfun$request$1.apply(WebServiceHelper.scala:54)\",\"scala.util.Success$$anonfun$map$1.apply(Try.scala:237)\",\"scala.util.Try$.apply(Try.scala:192)\",\"scala.util.Success.map(Try.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.Future$$anonfun$map$1.apply(Future.scala:237)\",\"scala.concurrent.impl.CallbackRunnable.run(Promise.scala:32)\",\"scala.concurrent.impl.ExecutionContextImpl$AdaptedForkJoinTask.exec(ExecutionContextImpl.scala:121)\",\"scala.concurrent.forkjoin.ForkJoinTask.doExec(ForkJoinTask.java:260)\",\"scala.concurrent.forkjoin.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1339)\",\"scala.concurrent.forkjoin.ForkJoinPool.runWorker(ForkJoinPool.java:1979)\",\"scala.concurrent.forkjoin.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:107)\"]}}"
        },
        "requestInfo": {
          "encrypted": false,
          "testUser": true,
          "failed": false,
          "messages": []
        }
      }
    """

  val wrapperWithMessages =
    """
      {
        "state": "eyJyZXF1ZXN0SWQiOiIxNjVhMjk1NS00YTE4LTIzYWUtMDAwMC0wMDAwMDAwMDAwMDQiLCJ1c2VyIjp7ImlkIjoiMzAwMDIxNzciLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZGxhc2RqQGRhc2QuY29tIiwiZmlyc3ROYW1lIjoic29tZXRoaW5nIiwibGFzdE5hbWUiOiJibGEiLCJjb3VudHJ5IjoiR0IiLCJzdGF0ZSI6bnVsbCwiYWxsb3dNZW1iZXJzaGlwTWFpbCI6ZmFsc2UsImFsbG93VGhpcmRQYXJ0eU1haWwiOmZhbHNlLCJhbGxvd0dVUmVsYXRlZE1haWwiOmZhbHNlLCJpc1Rlc3RVc2VyIjpmYWxzZX0sImNvbnRyaWJ1dGlvbiI6eyJhbW91bnQiOjMuNTIsImN1cnJlbmN5IjoiR0JQIiwiYmlsbGluZ1BlcmlvZCI6Ik1vbnRobHkifSwicGF5bWVudE1ldGhvZCI6eyJUb2tlbklkIjoiY2FyZF9DR2dWYUxzVENpdnFLdCIsIlNlY29uZFRva2VuSWQiOiJjdXNfQ0dnVlFnc0dGcWdQYlciLCJDcmVkaXRDYXJkTnVtYmVyIjoiNDI0MiIsIkNyZWRpdENhcmRDb3VudHJ5IjoiVVMiLCJDcmVkaXRDYXJkRXhwaXJhdGlvbk1vbnRoIjoxMiwiQ3JlZGl0Q2FyZEV4cGlyYXRpb25ZZWFyIjoyMDIxLCJDcmVkaXRDYXJkVHlwZSI6IlZpc2EiLCJUeXBlIjoiQ3JlZGl0Q2FyZFJlZmVyZW5jZVRyYW5zYWN0aW9uIn0sImFjcXVpc2l0aW9uRGF0YSI6eyJvcGhhbklkcyI6eyJwYWdldmlld0lkIjoiamRhNzQweWg3ZXJmYXdwenpmOW0iLCJ2aXNpdElkIjpudWxsLCJicm93c2VySWQiOm51bGx9LCJyZWZlcnJlckFjcXVpc2l0aW9uRGF0YSI6eyJjYW1wYWlnbkNvZGUiOm51bGwsInJlZmVycmVyUGFnZXZpZXdJZCI6bnVsbCwicmVmZXJyZXJVcmwiOm51bGwsImNvbXBvbmVudElkIjpudWxsLCJjb21wb25lbnRUeXBlIjpudWxsLCJzb3VyY2UiOm51bGwsImFiVGVzdCI6bnVsbH0sInN1cHBvcnRBYlRlc3RzIjpbeyJuYW1lIjoidXNTZWN1cmVMb2dvVGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifV19fQ==",
        "error": null,
        "requestInfo": {
          "encrypted": false,
          "testUser": false,
          "failed": false,
          "messages": [
            "Payment method is Stripe"
          ]
        }
      }
    """

}
