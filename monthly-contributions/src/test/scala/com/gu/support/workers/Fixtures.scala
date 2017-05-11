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
          "allowMembershipMail": false,
          "allowThirdPartyMail": false,
          "allowGURelatedMail": false
        }
    """
  val validBaid = "B-23637766K5365543J"
  val payPalEmail = "test@paypal.com"
  val payPalPaymentMethod =
    s"""
         {
           "PayPalReferenceTransaction" : {
              "paypalBaid": "$validBaid",
              "paypalEmail": "$payPalEmail",
              "paypalType": "ExpressCheckout",
              "type": "PayPal"
           }
         }
       """

  val payPalJson =
    s"""
                {
                  "paypalBaid": "$validBaid"
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
          $userJson,
          "amount": 5,
          "paymentFields": $payPalJson
        }"""

  val createStripePaymentMethodJson =
    s"""{
          $userJson,
          "amount": 5,
          "paymentFields": $stripeJson
        }"""

  val createSalesForceContactJson =
    s"""
          {
            $userJson,
            "amount": 5,
            "paymentMethod": $payPalPaymentMethod
          }
        """

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
            $userJson,
            "amount": 5,
            "paymentMethod": $payPalPaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
        """
}
