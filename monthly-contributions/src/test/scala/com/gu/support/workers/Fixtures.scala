package com.gu.support.workers

import com.gu.salesforce.Fixtures.idId

object Fixtures {
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

  val contributionJson =
    """
      {
        "amount": 5,
        "currency": "GBP"
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
          "contribution": $contributionJson,
          "paymentFields": $payPalJson
        }"""

  val createStripePaymentMethodJson =
    s"""{
          $requestIdJson,
          $userJson,
          "contribution": $contributionJson,
          "paymentFields": $stripeJson
        }"""

  val createSalesForceContactJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "contribution": $contributionJson,
            "paymentMethod": $payPalPaymentMethod
          }
        """

  val thankYouEmailJson =
    s"""{
        |  $requestIdJson,
        |  $userJson,
        |  "contribution": $contributionJson,
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
  val createZuoraSubscriptionJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "contribution": $contributionJson,
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
       |  "contribution": $contributionJson,
       |  "error": {
       |    "Error": "com.gu.support.workers.exceptions.ErrorHandler.logAndRethrow(ErrorHandler.scala:33)",
       |    "Cause": "The card has expired"
       |  }
       |}
     """.stripMargin
}
