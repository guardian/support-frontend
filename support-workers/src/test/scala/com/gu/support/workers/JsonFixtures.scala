package com.gu.support.workers

import java.io.ByteArrayInputStream

import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Fixtures.{emailAddress, idId}
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.encoding.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Wrapper
import io.circe.generic.auto._
import io.circe.syntax._

//noinspection TypeAnnotation
object JsonFixtures {
  val useEncryption = false

  def wrapFixture(string: String): ByteArrayInputStream =
    Wrapper.wrapString(string, RequestInfo(useEncryption, testUser = false, failed = false, Nil)).asJson.noSpaces.asInputStream

  val userJson =
    s"""
      "user":{
          "id": "$idId",
          "primaryEmailAddress": "$emailAddress",
          "firstName": "test",
          "lastName": "user",
          "country": "GB",
          "billingAddress": {
            "country": "GB"
          },
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

  val createEverydayPaperSubscriptionJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "product": ${everydayPaperJson},
            "paymentMethod": $stripePaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
      """

  val failureJson =
    """{
          "state": "eyJyZXF1ZXN0SWQiOiI5NjViOTU1Zi00MmQ4LWEwMDEtMDAwMC0wMDAwMDAwMDAwMDIiLCJ1c2VyIjp7ImlkIjoiMTAwMDAzNDUzIiwicHJpbWFyeUVtYWlsQWRkcmVzcyI6InNzbGpmc2Rsa2ZzZGxmQGd1LmNvbSIsImZpcnN0TmFtZSI6InNsZmtzZGtsZiIsImxhc3ROYW1lIjoic2xka2ZqZHNsZmoiLCJiaWxsaW5nQWRkcmVzcyI6eyJjb3VudHJ5IjoiR0IifSwiY291bnRyeSI6IkdCIiwic3RhdGUiOm51bGwsInRlbGVwaG9uZU51bWJlciI6IiIsImFsbG93TWVtYmVyc2hpcE1haWwiOmZhbHNlLCJhbGxvd1RoaXJkUGFydHlNYWlsIjpmYWxzZSwiYWxsb3dHVVJlbGF0ZWRNYWlsIjpmYWxzZSwiaXNUZXN0VXNlciI6ZmFsc2V9LCJwcm9kdWN0Ijp7ImN1cnJlbmN5IjoiR0JQIiwiYmlsbGluZ1BlcmlvZCI6Ik1vbnRobHkifSwicGF5bWVudE1ldGhvZCI6eyJUb2tlbklkIjoiY2FyZF9FUmY1dHcyNDVGY2Q0RiIsIlNlY29uZFRva2VuSWQiOiJjdXNfRVJmNWM2ajJ5OUEwWFYiLCJDcmVkaXRDYXJkTnVtYmVyIjoiNDI0MiIsIkNyZWRpdENhcmRDb3VudHJ5IjoiVVMiLCJDcmVkaXRDYXJkRXhwaXJhdGlvbk1vbnRoIjoyLCJDcmVkaXRDYXJkRXhwaXJhdGlvblllYXIiOjIwMjIsIkNyZWRpdENhcmRUeXBlIjoiVmlzYSIsIlR5cGUiOiJDcmVkaXRDYXJkUmVmZXJlbmNlVHJhbnNhY3Rpb24ifSwicHJvbW9Db2RlIjoiREpSSFlNRFM4Iiwic2FsZXNGb3JjZUNvbnRhY3QiOnsiSWQiOiIwMDM2RTAwMDAwVmxPUERRQTMiLCJBY2NvdW50SWQiOiIwMDE2RTAwMDAwZjE3cFlRQVEifSwiYWNxdWlzaXRpb25EYXRhIjp7Im9waGFuSWRzIjp7InBhZ2V2aWV3SWQiOiJqcmwxcnpyY25qNWdrM2oyMXN0dyIsInZpc2l0SWQiOm51bGwsImJyb3dzZXJJZCI6bnVsbH0sInJlZmVycmVyQWNxdWlzaXRpb25EYXRhIjp7ImNhbXBhaWduQ29kZSI6bnVsbCwicmVmZXJyZXJQYWdldmlld0lkIjpudWxsLCJyZWZlcnJlclVybCI6bnVsbCwiY29tcG9uZW50SWQiOm51bGwsImNvbXBvbmVudFR5cGUiOm51bGwsInNvdXJjZSI6bnVsbCwiYWJUZXN0cyI6bnVsbCwicXVlcnlQYXJhbWV0ZXJzIjpbeyJuYW1lIjoiZGlzcGxheUNoZWNrb3V0IiwidmFsdWUiOiJ0cnVlIn1dLCJob3N0bmFtZSI6InN1cHBvcnQudGhlZ3Vsb2NhbC5jb20iLCJnYUNsaWVudElkIjoiR0ExLjIuMTUwNjcwMTk4OC4xNTQ1NDA5MDcxIiwidXNlckFnZW50IjoiTW96aWxsYS81LjAoTWFjaW50b3NoO0ludGVsTWFjT1NYMTBfMTNfMilBcHBsZVdlYktpdC81MzcuMzYoS0hUTUwsbGlrZUdlY2tvKUNocm9tZS83MS4wLjM1NzguOThTYWZhcmkvNTM3LjM2IiwiaXBBZGRyZXNzIjoiMTI3LjAuMC4xIn0sInN1cHBvcnRBYlRlc3RzIjpbXX19",
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
        "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDMiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZnlneGlsbXhiNXFtb2FrbXVpY0BndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiYmlsbGluZ0FkZHJlc3MiOnsiY291bnRyeSI6IkdCIn0sImNvdW50cnkiOiJHQiIsInN0YXRlIjpudWxsLCJhbGxvd01lbWJlcnNoaXBNYWlsIjpmYWxzZSwiYWxsb3dUaGlyZFBhcnR5TWFpbCI6ZmFsc2UsImFsbG93R1VSZWxhdGVkTWFpbCI6ZmFsc2UsImlzVGVzdFVzZXIiOmZhbHNlfSwiY29udHJpYnV0aW9uIjp7ImFtb3VudCI6NSwiY3VycmVuY3kiOiJHQlAiLCJiaWxsaW5nUGVyaW9kIjoiTW9udGhseSJ9LCJwYXltZW50RmllbGRzIjp7InVzZXJJZCI6IjMwMDAxNjQzIiwic3RyaXBlVG9rZW4iOiJ0b2tfY2hhcmdlRGVjbGluZWQifSwiYWNxdWlzaXRpb25EYXRhIjp7Im9waGFuSWRzIjp7InBhZ2V2aWV3SWQiOiJqYWlnbng4bWx3YXpoaHBhcTl0ayIsInZpc2l0SWQiOm51bGwsImJyb3dzZXJJZCI6bnVsbH0sInJlZmVycmVyQWNxdWlzaXRpb25EYXRhIjp7ImNhbXBhaWduQ29kZSI6bnVsbCwicmVmZXJyZXJQYWdldmlld0lkIjpudWxsLCJyZWZlcnJlclVybCI6bnVsbCwiY29tcG9uZW50SWQiOm51bGwsImNvbXBvbmVudFR5cGUiOm51bGwsInNvdXJjZSI6bnVsbCwiYWJUZXN0IjpudWxsfSwic3VwcG9ydEFiVGVzdHMiOlt7Im5hbWUiOiJ1c1JlY3VycmluZ0NvcHlUZXN0IiwidmFyaWFudCI6Im5vdGludGVzdCJ9LHsibmFtZSI6InVrUmVjdXJyaW5nQW1vdW50c1Rlc3QiLCJ2YXJpYW50IjoibG93ZXIifSx7Im5hbWUiOiJ1c1JlY3VycmluZ0Ftb3VudHNUZXN0IiwidmFyaWFudCI6Im5vdGludGVzdCJ9XX19",
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
      "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDMiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoidGVzdEBndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiYmlsbGluZ0FkZHJlc3MiOnsiY291bnRyeSI6IkdCIn0sImNvdW50cnkiOiJHQiIsInN0YXRlIjpudWxsLCJhbGxvd01lbWJlcnNoaXBNYWlsIjpmYWxzZSwiYWxsb3dUaGlyZFBhcnR5TWFpbCI6ZmFsc2UsImFsbG93R1VSZWxhdGVkTWFpbCI6ZmFsc2UsImlzVGVzdFVzZXIiOmZhbHNlfSwicHJvZHVjdCI6eyJjdXJyZW5jeSI6IkdCUCIsImJpbGxpbmdQZXJpb2QiOiJBbm51YWwifSwicGF5bWVudEZpZWxkcyI6eyJ1c2VySWQiOiIzMDAwMTY0MyIsInN0cmlwZVRva2VuIjoidG9rX2NoYXJnZURlY2xpbmVkIn0sImFjcXVpc2l0aW9uRGF0YSI6eyJvcGhhbklkcyI6eyJwYWdldmlld0lkIjoiamFpZ254OG1sd2F6aGhwYXE5dGsiLCJ2aXNpdElkIjpudWxsLCJicm93c2VySWQiOm51bGx9LCJyZWZlcnJlckFjcXVpc2l0aW9uRGF0YSI6eyJjYW1wYWlnbkNvZGUiOm51bGwsInJlZmVycmVyUGFnZXZpZXdJZCI6bnVsbCwicmVmZXJyZXJVcmwiOm51bGwsImNvbXBvbmVudElkIjpudWxsLCJjb21wb25lbnRUeXBlIjpudWxsLCJzb3VyY2UiOm51bGwsImFiVGVzdCI6bnVsbH0sInN1cHBvcnRBYlRlc3RzIjpbeyJuYW1lIjoidXNSZWN1cnJpbmdDb3B5VGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifSx7Im5hbWUiOiJ1a1JlY3VycmluZ0Ftb3VudHNUZXN0IiwidmFyaWFudCI6Imxvd2VyIn0seyJuYW1lIjoidXNSZWN1cnJpbmdBbW91bnRzVGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifV19fQ==",
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
        "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDQiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZnlneGlsbXhiNXFtb2FrbXVpY0BndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiYmlsbGluZ0FkZHJlc3MiOnsiY291bnRyeSI6IkdCIn0sImNvdW50cnkiOiJHQiIsInN0YXRlIjpudWxsLCJhbGxvd01lbWJlcnNoaXBNYWlsIjpmYWxzZSwiYWxsb3dUaGlyZFBhcnR5TWFpbCI6ZmFsc2UsImFsbG93R1VSZWxhdGVkTWFpbCI6ZmFsc2UsImlzVGVzdFVzZXIiOmZhbHNlfSwicHJvZHVjdCI6eyJjdXJyZW5jeSI6IkdCUCIsImJpbGxpbmdQZXJpb2QiOiJNb250aGx5IiwiYW1vdW50Ijo1LCJ0eXBlIjoiQ29udHJpYnV0aW9uIn0sInBheW1lbnRNZXRob2QiOnsiVG9rZW5JZCI6ImNhcmRfQnF1eWozRlZWUzhienQiLCJTZWNvbmRUb2tlbklkIjoiY3VzX0JxdXlJdjA2YWlOOTJlIiwiQ3JlZGl0Q2FyZE51bWJlciI6IjAzNDEiLCJDcmVkaXRDYXJkQ291bnRyeSI6IlVTIiwiQ3JlZGl0Q2FyZEV4cGlyYXRpb25Nb250aCI6OCwiQ3JlZGl0Q2FyZEV4cGlyYXRpb25ZZWFyIjoyMDE5LCJDcmVkaXRDYXJkVHlwZSI6IlZpc2EiLCJUeXBlIjoiQ3JlZGl0Q2FyZFJlZmVyZW5jZVRyYW5zYWN0aW9uIn0sInNhbGVzRm9yY2VDb250YWN0Ijp7IklkIjoiMDAzZzAwMDAwMWNVeWkxQUFDIiwiQWNjb3VudElkIjoiMDAxZzAwMDAwMW5Ic3BkQUFDIn0sImFjcXVpc2l0aW9uRGF0YSI6eyJvcGhhbklkcyI6eyJwYWdldmlld0lkIjoiamFpZ254OG1sd2F6aGhwYXE5dGsiLCJ2aXNpdElkIjpudWxsLCJicm93c2VySWQiOm51bGx9LCJyZWZlcnJlckFjcXVpc2l0aW9uRGF0YSI6eyJjYW1wYWlnbkNvZGUiOm51bGwsInJlZmVycmVyUGFnZXZpZXdJZCI6bnVsbCwicmVmZXJyZXJVcmwiOm51bGwsImNvbXBvbmVudElkIjpudWxsLCJjb21wb25lbnRUeXBlIjpudWxsLCJzb3VyY2UiOm51bGwsImFiVGVzdCI6bnVsbH0sInN1cHBvcnRBYlRlc3RzIjpbeyJuYW1lIjoidXNSZWN1cnJpbmdDb3B5VGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifSx7Im5hbWUiOiJ1a1JlY3VycmluZ0Ftb3VudHNUZXN0IiwidmFyaWFudCI6Imxvd2VyIn0seyJuYW1lIjoidXNSZWN1cnJpbmdBbW91bnRzVGVzdCIsInZhcmlhbnQiOiJub3RpbnRlc3QifV19fQ==",
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
        "state": "eyJyZXF1ZXN0SWQiOiIyOTlmMDIwNC04ZjgyLWY0NzktMDAwMC0wMDAwMDAwMGUzM2QiLCJ1c2VyIjp7ImlkIjoiMzAwMDE2NDMiLCJwcmltYXJ5RW1haWxBZGRyZXNzIjoiZnlneGlsbXhiNXFtb2FrbXVpY0BndS5jb20iLCJmaXJzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwibGFzdE5hbWUiOiJGeWd4aWxNeEI1UU1vQWttdUljIiwiY291bnRyeSI6IkdCIiwiYmlsbGluZ0FkZHJlc3MiOnsiY291bnRyeSI6IkdCIn0sInN0YXRlIjpudWxsLCJhbGxvd01lbWJlcnNoaXBNYWlsIjpmYWxzZSwiYWxsb3dUaGlyZFBhcnR5TWFpbCI6ZmFsc2UsImFsbG93R1VSZWxhdGVkTWFpbCI6ZmFsc2UsImlzVGVzdFVzZXIiOmZhbHNlfSwicHJvZHVjdCI6eyJjdXJyZW5jeSI6IkdCUCIsImJpbGxpbmdQZXJpb2QiOiJNb250aGx5IiwiYW1vdW50Ijo1LCJ0eXBlIjoiQ29udHJpYnV0aW9uIn0sInBheW1lbnRGaWVsZHMiOnsidXNlcklkIjoiMzAwMDE2NDMiLCJzdHJpcGVUb2tlbiI6InRva19jaGFyZ2VEZWNsaW5lZCJ9LCJhY3F1aXNpdGlvbkRhdGEiOnsib3BoYW5JZHMiOnsicGFnZXZpZXdJZCI6ImphaWdueDhtbHdhemhocGFxOXRrIiwidmlzaXRJZCI6bnVsbCwiYnJvd3NlcklkIjpudWxsfSwicmVmZXJyZXJBY3F1aXNpdGlvbkRhdGEiOnsiY2FtcGFpZ25Db2RlIjpudWxsLCJyZWZlcnJlclBhZ2V2aWV3SWQiOm51bGwsInJlZmVycmVyVXJsIjpudWxsLCJjb21wb25lbnRJZCI6bnVsbCwiY29tcG9uZW50VHlwZSI6bnVsbCwic291cmNlIjpudWxsLCJhYlRlc3QiOm51bGx9LCJzdXBwb3J0QWJUZXN0cyI6W3sibmFtZSI6InVzUmVjdXJyaW5nQ29weVRlc3QiLCJ2YXJpYW50Ijoibm90aW50ZXN0In0seyJuYW1lIjoidWtSZWN1cnJpbmdBbW91bnRzVGVzdCIsInZhcmlhbnQiOiJsb3dlciJ9LHsibmFtZSI6InVzUmVjdXJyaW5nQW1vdW50c1Rlc3QiLCJ2YXJpYW50Ijoibm90aW50ZXN0In1dfX0=",
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
        "state": "eyJyZXF1ZXN0SWQiOiI5NjViOTU1Zi00MmQ4LWEwMDEtMDAwMC0wMDAwMDAwMDAwMDIiLCJ1c2VyIjp7ImlkIjoiMTAwMDAzNDUzIiwicHJpbWFyeUVtYWlsQWRkcmVzcyI6InNzbGpmc2Rsa2ZzZGxmQGd1LmNvbSIsImZpcnN0TmFtZSI6InNsZmtzZGtsZiIsImxhc3ROYW1lIjoic2xka2ZqZHNsZmoiLCJiaWxsaW5nQWRkcmVzcyI6eyJjb3VudHJ5IjoiR0IifSwiY291bnRyeSI6IkdCIiwic3RhdGUiOm51bGwsInRlbGVwaG9uZU51bWJlciI6IiIsImFsbG93TWVtYmVyc2hpcE1haWwiOmZhbHNlLCJhbGxvd1RoaXJkUGFydHlNYWlsIjpmYWxzZSwiYWxsb3dHVVJlbGF0ZWRNYWlsIjpmYWxzZSwiaXNUZXN0VXNlciI6ZmFsc2V9LCJwcm9kdWN0Ijp7ImN1cnJlbmN5IjoiR0JQIiwiYmlsbGluZ1BlcmlvZCI6Ik1vbnRobHkifSwicGF5bWVudE1ldGhvZCI6eyJUb2tlbklkIjoiY2FyZF9FUmY1dHcyNDVGY2Q0RiIsIlNlY29uZFRva2VuSWQiOiJjdXNfRVJmNWM2ajJ5OUEwWFYiLCJDcmVkaXRDYXJkTnVtYmVyIjoiNDI0MiIsIkNyZWRpdENhcmRDb3VudHJ5IjoiVVMiLCJDcmVkaXRDYXJkRXhwaXJhdGlvbk1vbnRoIjoyLCJDcmVkaXRDYXJkRXhwaXJhdGlvblllYXIiOjIwMjIsIkNyZWRpdENhcmRUeXBlIjoiVmlzYSIsIlR5cGUiOiJDcmVkaXRDYXJkUmVmZXJlbmNlVHJhbnNhY3Rpb24ifSwicHJvbW9Db2RlIjoiREpSSFlNRFM4Iiwic2FsZXNGb3JjZUNvbnRhY3QiOnsiSWQiOiIwMDM2RTAwMDAwVmxPUERRQTMiLCJBY2NvdW50SWQiOiIwMDE2RTAwMDAwZjE3cFlRQVEifSwiYWNxdWlzaXRpb25EYXRhIjp7Im9waGFuSWRzIjp7InBhZ2V2aWV3SWQiOiJqcmwxcnpyY25qNWdrM2oyMXN0dyIsInZpc2l0SWQiOm51bGwsImJyb3dzZXJJZCI6bnVsbH0sInJlZmVycmVyQWNxdWlzaXRpb25EYXRhIjp7ImNhbXBhaWduQ29kZSI6bnVsbCwicmVmZXJyZXJQYWdldmlld0lkIjpudWxsLCJyZWZlcnJlclVybCI6bnVsbCwiY29tcG9uZW50SWQiOm51bGwsImNvbXBvbmVudFR5cGUiOm51bGwsInNvdXJjZSI6bnVsbCwiYWJUZXN0cyI6bnVsbCwicXVlcnlQYXJhbWV0ZXJzIjpbeyJuYW1lIjoiZGlzcGxheUNoZWNrb3V0IiwidmFsdWUiOiJ0cnVlIn1dLCJob3N0bmFtZSI6InN1cHBvcnQudGhlZ3Vsb2NhbC5jb20iLCJnYUNsaWVudElkIjoiR0ExLjIuMTUwNjcwMTk4OC4xNTQ1NDA5MDcxIiwidXNlckFnZW50IjoiTW96aWxsYS81LjAoTWFjaW50b3NoO0ludGVsTWFjT1NYMTBfMTNfMilBcHBsZVdlYktpdC81MzcuMzYoS0hUTUwsbGlrZUdlY2tvKUNocm9tZS83MS4wLjM1NzguOThTYWZhcmkvNTM3LjM2IiwiaXBBZGRyZXNzIjoiMTI3LjAuMC4xIn0sInN1cHBvcnRBYlRlc3RzIjpbXX19",
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

  val digipackSubscriptionWithDiscountAndFreeTrialJson =
    """
        {
          "state": "eyJyZXF1ZXN0SWQiOiI5NjViOTU1Zi00MmQ4LWEwMDEtMDAwMC0wMDAwMDAwMDAwMDIiLCJ1c2VyIjp7ImlkIjoiMTAwMDAzNDUzIiwicHJpbWFyeUVtYWlsQWRkcmVzcyI6InNzbGpmc2Rsa2ZzZGxmQGd1LmNvbSIsImZpcnN0TmFtZSI6InNsZmtzZGtsZiIsImxhc3ROYW1lIjoic2xka2ZqZHNsZmoiLCAiYmlsbGluZ0FkZHJlc3MiOiB7ImNvdW50cnkiOiJHQiJ9LCAiY291bnRyeSI6IkdCIiwic3RhdGUiOm51bGwsInRlbGVwaG9uZU51bWJlciI6IiIsImFsbG93TWVtYmVyc2hpcE1haWwiOmZhbHNlLCJhbGxvd1RoaXJkUGFydHlNYWlsIjpmYWxzZSwiYWxsb3dHVVJlbGF0ZWRNYWlsIjpmYWxzZSwiaXNUZXN0VXNlciI6ZmFsc2V9LCJwcm9kdWN0Ijp7ImN1cnJlbmN5IjoiR0JQIiwiYmlsbGluZ1BlcmlvZCI6Ik1vbnRobHkifSwicGF5bWVudE1ldGhvZCI6eyJUb2tlbklkIjoiY2FyZF9FUmY1dHcyNDVGY2Q0RiIsIlNlY29uZFRva2VuSWQiOiJjdXNfRVJmNWM2ajJ5OUEwWFYiLCJDcmVkaXRDYXJkTnVtYmVyIjoiNDI0MiIsIkNyZWRpdENhcmRDb3VudHJ5IjoiVVMiLCJDcmVkaXRDYXJkRXhwaXJhdGlvbk1vbnRoIjoyLCJDcmVkaXRDYXJkRXhwaXJhdGlvblllYXIiOjIwMjIsIkNyZWRpdENhcmRUeXBlIjoiVmlzYSIsIlR5cGUiOiJDcmVkaXRDYXJkUmVmZXJlbmNlVHJhbnNhY3Rpb24ifSwicHJvbW9Db2RlIjoiREpSSFlNRFM4Iiwic2FsZXNGb3JjZUNvbnRhY3QiOnsiSWQiOiIwMDM2RTAwMDAwVmxPUERRQTMiLCJBY2NvdW50SWQiOiIwMDE2RTAwMDAwZjE3cFlRQVEifSwiYWNxdWlzaXRpb25EYXRhIjp7Im9waGFuSWRzIjp7InBhZ2V2aWV3SWQiOiJqcmwxcnpyY25qNWdrM2oyMXN0dyIsInZpc2l0SWQiOm51bGwsImJyb3dzZXJJZCI6bnVsbH0sInJlZmVycmVyQWNxdWlzaXRpb25EYXRhIjp7ImNhbXBhaWduQ29kZSI6bnVsbCwicmVmZXJyZXJQYWdldmlld0lkIjpudWxsLCJyZWZlcnJlclVybCI6bnVsbCwiY29tcG9uZW50SWQiOm51bGwsImNvbXBvbmVudFR5cGUiOm51bGwsInNvdXJjZSI6bnVsbCwiYWJUZXN0cyI6bnVsbCwicXVlcnlQYXJhbWV0ZXJzIjpbeyJuYW1lIjoiZGlzcGxheUNoZWNrb3V0IiwidmFsdWUiOiJ0cnVlIn1dLCJob3N0bmFtZSI6InN1cHBvcnQudGhlZ3Vsb2NhbC5jb20iLCJnYUNsaWVudElkIjoiR0ExLjIuMTUwNjcwMTk4OC4xNTQ1NDA5MDcxIiwidXNlckFnZW50IjoiTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTNfMikgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzcxLjAuMzU3OC45OCBTYWZhcmkvNTM3LjM2IiwiaXBBZGRyZXNzIjoiMTI3LjAuMC4xIn0sInN1cHBvcnRBYlRlc3RzIjpbXX19",
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
      """.asInputStream

}
