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

  object CreatePaymentMethodFixtures {
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
  }


  object CreateSalesforceContactFixtures {
    val payPalEmail = "test@paypal.com"
    val payPalPaymentMethod =
      s"""
         {
           "PayPalReferenceTransaction" : {
              "baId": "$validBaid",
              "email": "$payPalEmail"
           }
         }
       """

    val createSalesForceContactJson =
      s"""{
        $userJson,
        "amount": 5,
        "paymentMethod": $payPalPaymentMethod
        }"""
  }
}
