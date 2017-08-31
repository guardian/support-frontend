package com.gu.support.workers

import java.io.ByteArrayInputStream

import com.gu.salesforce.Fixtures.idId
import com.gu.support.workers.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Wrapper
import com.gu.support.workers.encoding.Wrapper.jsonCodec
import io.circe.syntax._

//noinspection TypeAnnotation
object Fixtures {
  def wrapFixture(string: String): ByteArrayInputStream = Wrapper.wrapString(string).asJson.noSpaces.asInputStream

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

  val annualContributionJson =
    """
      {
        "amount": 150,
        "currency": "GBP",
        "billingPeriod": "Annual"
      }
    """

  val monthlyContributionJson =
    """
      {
        "amount": 5,
        "currency": "GBP",
        "billingPeriod": "Monthly"
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
                  "userId": "12345",
                  "stripeToken": "$stripeToken"
                }
                """

  val createPayPalPaymentMethodJson =
    s"""{
          $requestIdJson,
          $userJson,
          "contribution": $monthlyContributionJson,
          "paymentFields": $payPalJson
        }"""

  val createMonthlyStripeJson =
    s"""{
          $requestIdJson,
          $userJson,
          "contribution": $monthlyContributionJson,
          "paymentFields": $stripeJson
        }"""

  val createAnnualStripeJson =
    s"""{
          $requestIdJson,
          $userJson,
          "contribution": $annualContributionJson,
          "paymentFields": $stripeJson
        }"""

  val createSalesForceContactJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "contribution": $monthlyContributionJson,
            "paymentMethod": $payPalPaymentMethod
          }
        """

  val thankYouEmailJson =
    s"""{
       |  $requestIdJson,
       |  $userJson,
       |  "contribution": $monthlyContributionJson,
       |  "paymentMethod": $payPalPaymentMethod,
       |  "salesForceContact": {
       |    "Id": "123",
       |    "AccountId": "123"
       |  },
       |  "accountNumber": "123"
       |}
     """.stripMargin

  val updateMembersDataAPIJson =
    s"""{
       |  $requestIdJson,
       |  $userJson
       |}
     """.stripMargin

  val salesforceContactJson =
    """
        {
          "Id": "003g000001UnFItAAN",
          "AccountId": "001g000001gOR06AAG"
        }
      """
  val createMonthlyZuoraSubscriptionJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "contribution": $monthlyContributionJson,
            "paymentMethod": $payPalPaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
        """

  val createAnnualZuoraSubscriptionJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "contribution": $annualContributionJson,
            "paymentMethod": $payPalPaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
        """

  val stripeCardDeclinedErrorJson =
    s"""
       {
       }
     """

  val failureJson =
    s"""{
       |  $requestIdJson,
       |  $userJson,
       |  "contribution": $monthlyContributionJson,
       |  "error": {
       |    "Error": "com.gu.support.workers.exceptions.ErrorHandler.logAndRethrow(ErrorHandler.scala:33)",
       |    "Cause": "The card has expired"
       |  }
       |}
     """.stripMargin
}
