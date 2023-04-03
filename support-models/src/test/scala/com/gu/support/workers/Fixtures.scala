package com.gu.support.workers

import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP

//noinspection TypeAnnotation
object Fixtures {
  val idId = "12345"
  val email = "test@thegulocal.com"
  val userJson =
    s"""
      "user":{
          "id": "$idId",
          "primaryEmailAddress": "$email",
          "firstName": "test",
          "lastName": "user",
          "country": "GB",
          "billingAddress": {
            "country": "GB"
          },

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
              "Type": "PayPal",
              "PaymentGateway": "PayPal Express"
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
        "readerType": "Direct",
        "amount": 20
      }
    """

  val digitalPackProductJson =
    s"""
      "product": $digitalPackJson
    """

  val guardianWeeklyJson =
    s"""
       "product": {
         "productType": "GuardianWeekly",
         "currency": "GBP",
         "billingPeriod" : "Annual",
         "fulfilmentOptions": "RestOfWorld"
      }
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
        "accountNumber": "99999999",
        "recaptchaToken": "test"
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
          "analyticsInfo": {
            "paymentProvider": "PayPal",
            "isGiftPurchase": false
          },
          "paymentFields": $payPalJson,
          "acquisitionData": $acquisitionData,
          "ipAddress": "127.0.0.1",
          "userAgent": "TestAgent"
        }"""

  def createStripePaymentMethodContributionJson(
      billingPeriod: BillingPeriod = Monthly,
      amount: BigDecimal = 5,
  ): String =
    s"""{
          $requestIdJson,
          $userJson,
          "product": ${contribution(amount = amount, billingPeriod = billingPeriod)},
          "analyticsInfo": {
            "paymentProvider": "Stripe",
            "isGiftPurchase": false
          },
          "paymentFields": $stripeJson,
          "sessionId": "testingToken",
          "acquisitionData": $acquisitionData,
          "ipAddress": "127.0.0.1",
          "userAgent": "TestAgent"
        }"""

  val createPayPalPaymentMethodDigitalPackJson =
    s"""{
          $requestIdJson,
          $userJson,
          $digitalPackProductJson,
          "analyticsInfo": {
            "paymentProvider": "PayPal",
            "isGiftPurchase": false
          },
          "paymentFields": $payPalJson,
          "acquisitionData": $acquisitionData,
          "ipAddress": "127.0.0.1",
          "userAgent": "TestAgent"
        }"""

  val createDirectDebitDigitalPackJson =
    s"""{
          $requestIdJson,
          $userJson,
          $digitalPackProductJson,
          "analyticsInfo": {
            "paymentProvider": "DirectDebit",
            "isGiftPurchase": false
          },
          "paymentFields": $directDebitJson,
          "acquisitionData": $acquisitionData,
          "ipAddress": "127.0.0.1",
          "userAgent": "TestAgent"
        }"""

  val createDirectDebitGuardianWeeklyJson =
    s"""{
          $requestIdJson,
          $userJson,
          $guardianWeeklyJson,
          "analyticsInfo": {
            "paymentProvider": "DirectDebit",
            "isGiftPurchase": false
          },
          "paymentFields": $directDebitJson,
          "acquisitionData": $acquisitionData,
          "ipAddress": "127.0.0.1",
          "userAgent": "TestAgent"
        }"""

  val createSalesforceContactJson =
    s"""
          {
            $requestIdJson,
            $userJson,
            "product": ${contribution()},
            "analyticsInfo": {
              "paymentProvider": "PayPal",
              "isGiftPurchase": false
            },
            "paymentMethod": $payPalPaymentMethod,
            "acquisitionData": $acquisitionData
          }
        """

  val salesforceContactJson =
    """
        {
          "Id": "0033E00001Cq8D2QAJ",
          "AccountId": "0013E00001AU6xcQAD"
        }
      """

  val salesforceContactsJson =
    """{
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
    s"""
          {
            "productType": "Contribution",
            $requestIdJson,
            $userJson,
            "product": ${contribution(billingPeriod = billingPeriod)},
            "paymentMethod": $stripePaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
        """
  def createDigiPackZuoraSubscriptionJson: String =
    s"""
          {
            "productType": "DigitalSubscriptionDirectPurchase",
            "billingCountry": "GB",
            "product": $digitalPackJson,
            "paymentMethod": $stripePaymentMethod,
            "salesForceContact": $salesforceContactJson
            }
        """

  val zuoraErrorResponse =
    """[{"Code": "TRANSACTION_FAILED","Message": "Transaction declined.do_not_honor - Your card was declined."}]"""

}
