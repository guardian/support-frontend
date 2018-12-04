package com.gu.support.workers

import java.io.ByteArrayInputStream

import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Fixtures.{email, idId}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Wrapper
import com.gu.support.workers.model.{BillingPeriod, Monthly, RequestInfo}
import io.circe.generic.auto._
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
          "primaryEmailAddress": "$email",
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
           "Type": "CreditCardReferenceTransaction"
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

  val digitalPackJson =
    """
      {
        "currency": "GBP",
        "billingPeriod" : "Annual"
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
          "abTest":null,
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

  val stripeToken = "tok_AXY4M16p60c2sg"
  val stripeJson =
    s"""
      {
        "userId": "12345",
        "stripeToken": "$stripeToken"
      }
    """

  def createPayPalPaymentMethodContributionJson(currency: Currency = GBP): String =
    s"""{
          $requestIdJson,
          $userJson,
          "product": ${contribution(currency = currency)},
          "paymentFields": $payPalJson,
          "acquisitionData": $acquisitionData
        }"""

  def createStripePaymentMethodContributionJson(billingPeriod: BillingPeriod = Monthly, amount: BigDecimal = 5): String =
    s"""{
          $requestIdJson,
          $userJson,
          "product": ${contribution(amount = amount, billingPeriod = billingPeriod)},
          "paymentFields": $stripeJson,
          "sessionId": "testingToken"
        }"""

  val oldSchemaContributionJson =
    s"""{
          $requestIdJson,
          $userJson,
          "contribution": ${contribution()},
          "paymentFields": $stripeJson
        }"""

  val createPayPalPaymentMethodDigitalPackJson =
    s"""{
          $requestIdJson,
          $userJson,
          $digitalPackProductJson,
          "paymentFields": $payPalJson
        }"""

  val createDirectDebitDigitalPackJson =
    s"""{
          $requestIdJson,
          $userJson,
          $digitalPackProductJson,
          "paymentFields": $directDebitJson
        }"""

  val createSalesForceContactJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "product": ${contribution()},
            "paymentMethod": $payPalPaymentMethod
          }
        """

  def thankYouEmailJson(product: String = contribution()): String =
    s"""{
       |  $requestIdJson,
       |  $userJson,
       |  "product": ${product},
       |  "paymentMethod": $stripePaymentMethod,
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

  def createContributionZuoraSubscriptionJson(billingPeriod: BillingPeriod = Monthly) =
    s"""
          {
            $requestIdJson,
            $userJson,
            "product": ${contribution(billingPeriod = billingPeriod)},
            "paymentMethod": $stripePaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
        """
  val createDigiPackZuoraSubscriptionJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "product": ${digitalPackJson},
            "paymentMethod": $stripePaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
        """

  val createDigiPackSubscriptionWithPromoJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "product": ${digitalPackJson},
            "paymentMethod": $stripePaymentMethod,
            "promoCode": "DJP8L27FY",
            "salesForceContact": $salesforceContactJson
            }
        """

  val failureJson =
    """{
          "state": "ewogICJyZXF1ZXN0SWQiOiAiMjk5ZjAyMDQtOGY4Mi1mNDc5LTAwMDAtMDAwMDAwMDBlMzNkIiwKICAidXNlciI6IHsKICAgICJpZCI6ICIzMDAwMTY0MyIsCiAgICAicHJpbWFyeUVtYWlsQWRkcmVzcyI6ICJmeWd4aWxteGI1cW1vYWttdWljQGd1LmNvbSIsCiAgICAiZmlyc3ROYW1lIjogIkZ5Z3hpbE14QjVRTW9Ba211SWMiLAogICAgImxhc3ROYW1lIjogIkZ5Z3hpbE14QjVRTW9Ba211SWMiLAogICAgImNvdW50cnkiOiAiR0IiLAogICAgInN0YXRlIjogbnVsbCwKICAgICJhbGxvd01lbWJlcnNoaXBNYWlsIjogZmFsc2UsCiAgICAiYWxsb3dUaGlyZFBhcnR5TWFpbCI6IGZhbHNlLAogICAgImFsbG93R1VSZWxhdGVkTWFpbCI6IGZhbHNlLAogICAgImlzVGVzdFVzZXIiOiBmYWxzZQogIH0sCiAgInByb2R1Y3QiOiB7CiAgICAiY3VycmVuY3kiIDogIkdCUCIsCiAgICAiYmlsbGluZ1BlcmlvZCIgOiAiTW9udGhseSIsCiAgICAiYW1vdW50IiA6IDUsCiAgICAidHlwZSIgOiAiQ29udHJpYnV0aW9uIgogIH0sCiAgInBheW1lbnRGaWVsZHMiOiB7CiAgICAidXNlcklkIjogIjMwMDAxNjQzIiwKICAgICJzdHJpcGVUb2tlbiI6ICJ0b2tfY2hhcmdlRGVjbGluZWQiCiAgfSwKICAiYWNxdWlzaXRpb25EYXRhIjogewogICAgIm9waGFuSWRzIjogewogICAgICAicGFnZXZpZXdJZCI6ICJqYWlnbng4bWx3YXpoaHBhcTl0ayIsCiAgICAgICJ2aXNpdElkIjogbnVsbCwKICAgICAgImJyb3dzZXJJZCI6IG51bGwKICAgIH0sCiAgICAicmVmZXJyZXJBY3F1aXNpdGlvbkRhdGEiOiB7CiAgICAgICJjYW1wYWlnbkNvZGUiOiBudWxsLAogICAgICAicmVmZXJyZXJQYWdldmlld0lkIjogbnVsbCwKICAgICAgInJlZmVycmVyVXJsIjogbnVsbCwKICAgICAgImNvbXBvbmVudElkIjogbnVsbCwKICAgICAgImNvbXBvbmVudFR5cGUiOiBudWxsLAogICAgICAic291cmNlIjogbnVsbCwKICAgICAgImFiVGVzdCI6IG51bGwKICAgIH0sCiAgICAic3VwcG9ydEFiVGVzdHMiOiBbCiAgICAgIHsKICAgICAgICAibmFtZSI6ICJ1c1JlY3VycmluZ0NvcHlUZXN0IiwKICAgICAgICAidmFyaWFudCI6ICJub3RpbnRlc3QiCiAgICAgIH0sCiAgICAgIHsKICAgICAgICAibmFtZSI6ICJ1a1JlY3VycmluZ0Ftb3VudHNUZXN0IiwKICAgICAgICAidmFyaWFudCI6ICJsb3dlciIKICAgICAgfSwKICAgICAgewogICAgICAgICJuYW1lIjogInVzUmVjdXJyaW5nQW1vdW50c1Rlc3QiLAogICAgICAgICJ2YXJpYW50IjogIm5vdGludGVzdCIKICAgICAgfQogICAgXQogIH0KfQ==",
          "error": {
            "Error": "com.example.SomeError",
            "Cause": "Oh no! It's on fire!"
          },
          "requestInfo": {
            "encrypted": false,
            "testUser": false,
            "failed": false,
            "messages": []
          }
        }
     """

  val oldSchemaFailureJson =
    """{
          "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDQiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZnlneGlsbXhiNXFtb2FrbXVpY0BndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiY291bnRyeSI6IkdCIiwic3RhdGUiOm51bGwsImFsbG93TWVtYmVyc2hpcE1haWwiOmZhbHNlLCJhbGxvd1RoaXJkUGFydHlNYWlsIjpmYWxzZSwiYWxsb3dHVVJlbGF0ZWRNYWlsIjpmYWxzZSwiaXNUZXN0VXNlciI6ZmFsc2V9LCJjb250cmlidXRpb24iOnsiYW1vdW50Ijo1LCJjdXJyZW5jeSI6IkdCUCIsImJpbGxpbmdQZXJpb2QiOiJNb250aGx5In0sInBheW1lbnRNZXRob2QiOnsiVG9rZW5JZCI6ImNhcmRfQnF1eWozRlZWUzhienQiLCJTZWNvbmRUb2tlbklkIjoiY3VzX0JxdXlJdjA2YWlOOTJlIiwiQ3JlZGl0Q2FyZE51bWJlciI6IjAzNDEiLCJDcmVkaXRDYXJkQ291bnRyeSI6IlVTIiwiQ3JlZGl0Q2FyZEV4cGlyYXRpb25Nb250aCI6OCwiQ3JlZGl0Q2FyZEV4cGlyYXRpb25ZZWFyIjoyMDE5LCJDcmVkaXRDYXJkVHlwZSI6IlZpc2EiLCJUeXBlIjoiQ3JlZGl0Q2FyZFJlZmVyZW5jZVRyYW5zYWN0aW9uIn0sInNhbGVzRm9yY2VDb250YWN0Ijp7IklkIjoiMDAzZzAwMDAwMWNVeWkxQUFDIiwiQWNjb3VudElkIjoiMDAxZzAwMDAwMW5Ic3BkQUFDIn0sImFjcXVpc2l0aW9uRGF0YSI6eyJvcGhhbklkcyI6eyJwYWdldmlld0lkIjoiamFpZ254OG1sd2F6aGhwYXE5dGsiLCJ2aXNpdElkIjpudWxsLCJicm93c2VySWQiOm51bGx9LCJyZWZlcnJlckFjcXVpc2l0aW9uRGF0YSI6eyJjYW1wYWlnbkNvZGUiOm51bGwsInJlZmVycmVyUGFnZXZpZXdJZCI6bnVsbCwicmVmZXJyZXJVcmwiOm51bGwsImNvbXBvbmVudElkIjpudWxsLCJjb21wb25lbnRUeXBlIjpudWxsLCJzb3VyY2UiOm51bGwsImFiVGVzdCI6bnVsbH0sInN1cHBvcnRBYlRlc3RzIjpbeyJuYW1lIjoidXNSZWN1cnJpbmdDb3B5VGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifSx7Im5hbWUiOiJ1a1JlY3VycmluZ0Ftb3VudHNUZXN0IiwidmFyaWFudCI6Imxvd2VyIn0seyJuYW1lIjoidXNSZWN1cnJpbmdBbW91bnRzVGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifV19fQ==",
          "error": {
            "Error": "com.example.SomeError",
            "Cause": "Oh no! It's on fire!"
          },
          "requestInfo": {
            "encrypted": false,
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

  //This Json uses a test Stripe token which causes Stripe to return a card_declined response, but the product is a digital pack
  val digipackCardDeclinedStripeJson =
    """
    {
      "state": "CnsKICAicmVxdWVzdElkIjogIjI5OWYwMjA0LThmODItZjQ3OS0wMDAwLTAwMDAwMDAwZTMzZCIsCiAgInVzZXIiOiB7CiAgICAiaWQiOiAiMzAwMDE2NDMiLAogICAgInByaW1hcnlFbWFpbEFkZHJlc3MiOiAidGVzdEBndS5jb20iLAogICAgImZpcnN0TmFtZSI6ICJGeWd4aWxNeEI1UU1vQWttdUljIiwKICAgICJsYXN0TmFtZSI6ICJGeWd4aWxNeEI1UU1vQWttdUljIiwKICAgICJjb3VudHJ5IjogIkdCIiwKICAgICJzdGF0ZSI6IG51bGwsCiAgICAiYWxsb3dNZW1iZXJzaGlwTWFpbCI6IGZhbHNlLAogICAgImFsbG93VGhpcmRQYXJ0eU1haWwiOiBmYWxzZSwKICAgICJhbGxvd0dVUmVsYXRlZE1haWwiOiBmYWxzZSwKICAgICJpc1Rlc3RVc2VyIjogZmFsc2UKICB9LAogICJwcm9kdWN0IjogewogICAgImN1cnJlbmN5IjogIkdCUCIsCiAgICAiYmlsbGluZ1BlcmlvZCIgOiAiQW5udWFsIgogIH0sCiAgInBheW1lbnRGaWVsZHMiOiB7CiAgICAidXNlcklkIjogIjMwMDAxNjQzIiwKICAgICJzdHJpcGVUb2tlbiI6ICJ0b2tfY2hhcmdlRGVjbGluZWQiCiAgfSwKICAiYWNxdWlzaXRpb25EYXRhIjogewogICAgIm9waGFuSWRzIjogewogICAgICAicGFnZXZpZXdJZCI6ICJqYWlnbng4bWx3YXpoaHBhcTl0ayIsCiAgICAgICJ2aXNpdElkIjogbnVsbCwKICAgICAgImJyb3dzZXJJZCI6IG51bGwKICAgIH0sCiAgICAicmVmZXJyZXJBY3F1aXNpdGlvbkRhdGEiOiB7CiAgICAgICJjYW1wYWlnbkNvZGUiOiBudWxsLAogICAgICAicmVmZXJyZXJQYWdldmlld0lkIjogbnVsbCwKICAgICAgInJlZmVycmVyVXJsIjogbnVsbCwKICAgICAgImNvbXBvbmVudElkIjogbnVsbCwKICAgICAgImNvbXBvbmVudFR5cGUiOiBudWxsLAogICAgICAic291cmNlIjogbnVsbCwKICAgICAgImFiVGVzdCI6IG51bGwKICAgIH0sCiAgICAic3VwcG9ydEFiVGVzdHMiOiBbCiAgICAgIHsKICAgICAgICAibmFtZSI6ICJ1c1JlY3VycmluZ0NvcHlUZXN0IiwKICAgICAgICAidmFyaWFudCI6ICJub3RpbnRlc3QiCiAgICAgIH0sCiAgICAgIHsKICAgICAgICAibmFtZSI6ICJ1a1JlY3VycmluZ0Ftb3VudHNUZXN0IiwKICAgICAgICAidmFyaWFudCI6ICJsb3dlciIKICAgICAgfSwKICAgICAgewogICAgICAgICJuYW1lIjogInVzUmVjdXJyaW5nQW1vdW50c1Rlc3QiLAogICAgICAgICJ2YXJpYW50IjogIm5vdGludGVzdCIKICAgICAgfQogICAgXQogIH0KfQogIA==",
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
        "state": "ewogICJyZXF1ZXN0SWQiOiAiMjk5ZjAyMDQtOGY4Mi1mNDc5LTAwMDAtMDAwMDAwMDBlMzNkIiwKICAidXNlciI6IHsKICAgICJpZCI6ICIzMDAwMTY0NCIsCiAgICAicHJpbWFyeUVtYWlsQWRkcmVzcyI6ICJmeWd4aWxteGI1cW1vYWttdWljQGd1LmNvbSIsCiAgICAiZmlyc3ROYW1lIjogIkZ5Z3hpbE14QjVRTW9Ba211SWMiLAogICAgImxhc3ROYW1lIjogIkZ5Z3hpbE14QjVRTW9Ba211SWMiLAogICAgImNvdW50cnkiOiAiR0IiLAogICAgInN0YXRlIjogbnVsbCwKICAgICJhbGxvd01lbWJlcnNoaXBNYWlsIjogZmFsc2UsCiAgICAiYWxsb3dUaGlyZFBhcnR5TWFpbCI6IGZhbHNlLAogICAgImFsbG93R1VSZWxhdGVkTWFpbCI6IGZhbHNlLAogICAgImlzVGVzdFVzZXIiOiBmYWxzZQogIH0sCiAgInByb2R1Y3QiOiB7CiAgICAiY3VycmVuY3kiIDogIkdCUCIsCiAgICAiYmlsbGluZ1BlcmlvZCIgOiAiTW9udGhseSIsCiAgICAiYW1vdW50IiA6IDUsCiAgICAidHlwZSIgOiAiQ29udHJpYnV0aW9uIgogICAgfSwKICAicGF5bWVudE1ldGhvZCI6IHsKICAgICJUb2tlbklkIjogImNhcmRfQnF1eWozRlZWUzhienQiLAogICAgIlNlY29uZFRva2VuSWQiOiAiY3VzX0JxdXlJdjA2YWlOOTJlIiwKICAgICJDcmVkaXRDYXJkTnVtYmVyIjogIjAzNDEiLAogICAgIkNyZWRpdENhcmRDb3VudHJ5IjogIlVTIiwKICAgICJDcmVkaXRDYXJkRXhwaXJhdGlvbk1vbnRoIjogOCwKICAgICJDcmVkaXRDYXJkRXhwaXJhdGlvblllYXIiOiAyMDE5LAogICAgIkNyZWRpdENhcmRUeXBlIjogIlZpc2EiLAogICAgIlR5cGUiOiAiQ3JlZGl0Q2FyZFJlZmVyZW5jZVRyYW5zYWN0aW9uIgogIH0sCiAgInNhbGVzRm9yY2VDb250YWN0IjogewogICAgIklkIjogIjAwM2cwMDAwMDFjVXlpMUFBQyIsCiAgICAiQWNjb3VudElkIjogIjAwMWcwMDAwMDFuSHNwZEFBQyIKICB9LAogICJhY3F1aXNpdGlvbkRhdGEiOiB7CiAgICAib3BoYW5JZHMiOiB7CiAgICAgICJwYWdldmlld0lkIjogImphaWdueDhtbHdhemhocGFxOXRrIiwKICAgICAgInZpc2l0SWQiOiBudWxsLAogICAgICAiYnJvd3NlcklkIjogbnVsbAogICAgfSwKICAgICJyZWZlcnJlckFjcXVpc2l0aW9uRGF0YSI6IHsKICAgICAgImNhbXBhaWduQ29kZSI6IG51bGwsCiAgICAgICJyZWZlcnJlclBhZ2V2aWV3SWQiOiBudWxsLAogICAgICAicmVmZXJyZXJVcmwiOiBudWxsLAogICAgICAiY29tcG9uZW50SWQiOiBudWxsLAogICAgICAiY29tcG9uZW50VHlwZSI6IG51bGwsCiAgICAgICJzb3VyY2UiOiBudWxsLAogICAgICAiYWJUZXN0IjogbnVsbAogICAgfSwKICAgICJzdXBwb3J0QWJUZXN0cyI6IFsKICAgICAgewogICAgICAgICJuYW1lIjogInVzUmVjdXJyaW5nQ29weVRlc3QiLAogICAgICAgICJ2YXJpYW50IjogIm5vdGludGVzdCIKICAgICAgfSwKICAgICAgewogICAgICAgICJuYW1lIjogInVrUmVjdXJyaW5nQW1vdW50c1Rlc3QiLAogICAgICAgICJ2YXJpYW50IjogImxvd2VyIgogICAgICB9LAogICAgICB7CiAgICAgICAgIm5hbWUiOiAidXNSZWN1cnJpbmdBbW91bnRzVGVzdCIsCiAgICAgICAgInZhcmlhbnQiOiAibm90aW50ZXN0IgogICAgICB9CiAgICBdCiAgfQp9",
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
        "state": "ewogICJyZXF1ZXN0SWQiOiAiMjk5ZjAyMDQtOGY4Mi1mNDc5LTAwMDAtMDAwMDAwMDBlMzNkIiwKICAidXNlciI6IHsKICAgICJpZCI6ICIzMDAwMTY0MyIsCiAgICAicHJpbWFyeUVtYWlsQWRkcmVzcyI6ICJmeWd4aWxteGI1cW1vYWttdWljQGd1LmNvbSIsCiAgICAiZmlyc3ROYW1lIjogIkZ5Z3hpbE14QjVRTW9Ba211SWMiLAogICAgImxhc3ROYW1lIjogIkZ5Z3hpbE14QjVRTW9Ba211SWMiLAogICAgImNvdW50cnkiOiAiR0IiLAogICAgInN0YXRlIjogbnVsbCwKICAgICJhbGxvd01lbWJlcnNoaXBNYWlsIjogZmFsc2UsCiAgICAiYWxsb3dUaGlyZFBhcnR5TWFpbCI6IGZhbHNlLAogICAgImFsbG93R1VSZWxhdGVkTWFpbCI6IGZhbHNlLAogICAgImlzVGVzdFVzZXIiOiBmYWxzZQogIH0sCiAgInByb2R1Y3QiOiB7CiAgICAiY3VycmVuY3kiIDogIkdCUCIsCiAgICAiYmlsbGluZ1BlcmlvZCIgOiAiTW9udGhseSIsCiAgICAiYW1vdW50IiA6IDUsCiAgICAidHlwZSIgOiAiQ29udHJpYnV0aW9uIgogIH0sCiAgInBheW1lbnRGaWVsZHMiOiB7CiAgICAidXNlcklkIjogIjMwMDAxNjQzIiwKICAgICJzdHJpcGVUb2tlbiI6ICJ0b2tfY2hhcmdlRGVjbGluZWQiCiAgfSwKICAiYWNxdWlzaXRpb25EYXRhIjogewogICAgIm9waGFuSWRzIjogewogICAgICAicGFnZXZpZXdJZCI6ICJqYWlnbng4bWx3YXpoaHBhcTl0ayIsCiAgICAgICJ2aXNpdElkIjogbnVsbCwKICAgICAgImJyb3dzZXJJZCI6IG51bGwKICAgIH0sCiAgICAicmVmZXJyZXJBY3F1aXNpdGlvbkRhdGEiOiB7CiAgICAgICJjYW1wYWlnbkNvZGUiOiBudWxsLAogICAgICAicmVmZXJyZXJQYWdldmlld0lkIjogbnVsbCwKICAgICAgInJlZmVycmVyVXJsIjogbnVsbCwKICAgICAgImNvbXBvbmVudElkIjogbnVsbCwKICAgICAgImNvbXBvbmVudFR5cGUiOiBudWxsLAogICAgICAic291cmNlIjogbnVsbCwKICAgICAgImFiVGVzdCI6IG51bGwKICAgIH0sCiAgICAic3VwcG9ydEFiVGVzdHMiOiBbCiAgICAgIHsKICAgICAgICAibmFtZSI6ICJ1c1JlY3VycmluZ0NvcHlUZXN0IiwKICAgICAgICAidmFyaWFudCI6ICJub3RpbnRlc3QiCiAgICAgIH0sCiAgICAgIHsKICAgICAgICAibmFtZSI6ICJ1a1JlY3VycmluZ0Ftb3VudHNUZXN0IiwKICAgICAgICAidmFyaWFudCI6ICJsb3dlciIKICAgICAgfSwKICAgICAgewogICAgICAgICJuYW1lIjogInVzUmVjdXJyaW5nQW1vdW50c1Rlc3QiLAogICAgICAgICJ2YXJpYW50IjogIm5vdGludGVzdCIKICAgICAgfQogICAgXQogIH0KfQ==",
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
        "state": "ewogICJyZXF1ZXN0SWQiOiAiMTY1YTI5NTUtNGExOC0yM2FlLTAwMDAtMDAwMDAwMDAwMDA0IiwKICAidXNlciI6IHsKICAgICJpZCI6ICIzMDAwMjE3NyIsCiAgICAicHJpbWFyeUVtYWlsQWRkcmVzcyI6ICJkbGFzZGpAZGFzZC5jb20iLAogICAgImZpcnN0TmFtZSI6ICJzb21ldGhpbmciLAogICAgImxhc3ROYW1lIjogImJsYSIsCiAgICAiY291bnRyeSI6ICJHQiIsCiAgICAic3RhdGUiOiBudWxsLAogICAgImFsbG93TWVtYmVyc2hpcE1haWwiOiBmYWxzZSwKICAgICJhbGxvd1RoaXJkUGFydHlNYWlsIjogZmFsc2UsCiAgICAiYWxsb3dHVVJlbGF0ZWRNYWlsIjogZmFsc2UsCiAgICAiaXNUZXN0VXNlciI6IGZhbHNlCiAgfSwKICAicHJvZHVjdCI6IHsKICAgICJjdXJyZW5jeSIgOiAiR0JQIiwKICAgICJiaWxsaW5nUGVyaW9kIiA6ICJNb250aGx5IiwKICAgICJhbW91bnQiIDogNSwKICAgICJ0eXBlIiA6ICJDb250cmlidXRpb24iCiAgfSwKICAicGF5bWVudE1ldGhvZCI6IHsKICAgICJUb2tlbklkIjogImNhcmRfQ0dnVmFMc1RDaXZxS3QiLAogICAgIlNlY29uZFRva2VuSWQiOiAiY3VzX0NHZ1ZRZ3NHRnFnUGJXIiwKICAgICJDcmVkaXRDYXJkTnVtYmVyIjogIjQyNDIiLAogICAgIkNyZWRpdENhcmRDb3VudHJ5IjogIlVTIiwKICAgICJDcmVkaXRDYXJkRXhwaXJhdGlvbk1vbnRoIjogMTIsCiAgICAiQ3JlZGl0Q2FyZEV4cGlyYXRpb25ZZWFyIjogMjAyMSwKICAgICJDcmVkaXRDYXJkVHlwZSI6ICJWaXNhIiwKICAgICJUeXBlIjogIkNyZWRpdENhcmRSZWZlcmVuY2VUcmFuc2FjdGlvbiIKICB9LAogICJhY3F1aXNpdGlvbkRhdGEiOiB7CiAgICAib3BoYW5JZHMiOiB7CiAgICAgICJwYWdldmlld0lkIjogImpkYTc0MHloN2VyZmF3cHp6ZjltIiwKICAgICAgInZpc2l0SWQiOiBudWxsLAogICAgICAiYnJvd3NlcklkIjogbnVsbAogICAgfSwKICAgICJyZWZlcnJlckFjcXVpc2l0aW9uRGF0YSI6IHsKICAgICAgImNhbXBhaWduQ29kZSI6IG51bGwsCiAgICAgICJyZWZlcnJlclBhZ2V2aWV3SWQiOiBudWxsLAogICAgICAicmVmZXJyZXJVcmwiOiBudWxsLAogICAgICAiY29tcG9uZW50SWQiOiBudWxsLAogICAgICAiY29tcG9uZW50VHlwZSI6IG51bGwsCiAgICAgICJzb3VyY2UiOiBudWxsLAogICAgICAiYWJUZXN0IjogbnVsbAogICAgfSwKICAgICJzdXBwb3J0QWJUZXN0cyI6IFsKICAgICAgewogICAgICAgICJuYW1lIjogInVzU2VjdXJlTG9nb1Rlc3QiLAogICAgICAgICJ2YXJpYW50IjogIm5vdGludGVzdCIKICAgICAgfQogICAgXQogIH0KfQ==",
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

  val sendAcquisitionEventJson = wrapFixture(
    s"""{
          $requestIdJson,
          $userJson,
          "product": ${contribution(currency = GBP)},
          "paymentMethod": $stripePaymentMethod,
          "acquisitionData": $acquisitionData
        }"""
  )

}
