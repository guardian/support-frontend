package com.gu.support.workers

import java.io.ByteArrayInputStream

import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Fixtures.idId
import com.gu.support.workers.Conversions.StringInputStreamConversions
import com.gu.support.workers.encoding.Wrapper
import com.gu.support.workers.model.{BillingPeriod, Monthly}
import com.gu.zuora.encoding.CustomCodecs.jsonWrapperEncoder
import io.circe.syntax._

//noinspection TypeAnnotation
object Fixtures {
  val useEncryption = false

  def wrapFixture(string: String): ByteArrayInputStream = Wrapper.wrapString(string, useEncryption).asJson.noSpaces.asInputStream

  val oldJsonWrapper =
    """
      {"state":"CiAgICAgIHsKICAgICAgICAiYW1vdW50IjogNSwKICAgICAgICAiY3VycmVuY3kiOiAiR0JQIgogICAgICB9CiAgICA=","error":null}
    """.asInputStream

  val userJson =
    s"""
      "user":{
          "id": "$idId",
          "primaryEmailAddress": "test@gu.com",
          "firstName": "test",
          "lastName": "user",
          "country": "GBP",
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

  def contribution(amount: BigDecimal = 5,currency: Currency = GBP, billingPeriod: BillingPeriod = Monthly) =
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
                  "userId": "12345",
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
  val stripeCardDeclinedErrorJson =
    s"""
       {
       }
     """

  val failureJson =
    s"""{
       |  $requestIdJson,
       |  $userJson,
       |  "contribution": ${contribution()},
       |  "error": {
       |    "Error": "com.gu.support.workers.exceptions.ErrorHandler.logAndRethrow(ErrorHandler.scala:33)",
       |    "Cause": "The card has expired"
       |  }
       |}
     """.stripMargin
}
