package com.gu.zuora

import com.gu.config.Configuration
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.support.workers.model.{CreditCardReferenceTransaction, DirectDebitPaymentMethod, PayPalReferenceTransaction}
import com.gu.zuora.model._
import org.joda.time.LocalDate

//noinspection TypeAnnotation
object Fixtures {
  val accountNumber = "A00071408"

  val getAccountResponse =
    s"""
       {
         "basicInfo" : {
           "id" : "2c92c0f85bae511e015bcf31cde61532",
           "name" : "001g000001gPV73AAG",
           "accountNumber" : "$accountNumber",
           "notes" : null,
           "status" : "Active",
           "crmId" : "001g000001gPV73AAG",
           "batch" : "Batch1",
           "invoiceTemplateId" : "2c92c0f849369b8801493bf7db7e450e",
           "communicationProfileId" : null,
           "IdentityId__c" : "30000291",
           "sfContactId__c" : "003g000001UtN1qAAF",
           "CCURN__c" : null
         },
         "billingAndPayment" : {
           "billCycleDay" : 3,
           "currency" : "GBP",
           "paymentTerm" : "Due Upon Receipt",
           "paymentGateway" : "Stripe Gateway 1",
           "invoiceDeliveryPrefsPrint" : false,
           "invoiceDeliveryPrefsEmail" : false,
           "additionalEmailAddresses" : [ ]
         },
         "metrics" : {
           "balance" : 0E-9,
           "totalInvoiceBalance" : 0E-9,
           "creditBalance" : 0E-9,
           "contractedMrr" : 4.250000000
         },
         "billToContact" : {
           "address1" : "Test",
           "address2" : "TEst",
           "city" : "Test",
           "country" : "United Kingdom",
           "county" : null,
           "fax" : null,
           "firstName" : "Test",
           "homePhone" : null,
           "lastName" : "Test",
           "mobilePhone" : null,
           "nickname" : null,
           "otherPhone" : null,
           "otherPhoneType" : null,
           "personalEmail" : null,
           "state" : "Test",
           "taxRegion" : null,
           "workEmail" : "test@foo.com",
           "workPhone" : null,
           "zipCode" : "T223EST",
           "SpecialDeliveryInstructions__c" : null
         },
         "soldToContact" : {
           "address1" : "Test",
           "address2" : "TEst",
           "city" : "Test",
           "country" : "United Kingdom",
           "county" : null,
           "fax" : null,
           "firstName" : "Test",
           "homePhone" : null,
           "lastName" : "Test",
           "mobilePhone" : null,
           "nickname" : null,
           "otherPhone" : null,
           "otherPhoneType" : null,
           "personalEmail" : null,
           "state" : "Test",
           "taxRegion" : null,
           "workEmail" : "test@foo.com",
           "workPhone" : null,
           "zipCode" : "T223EST",
           "SpecialDeliveryInstructions__c" : null
         },
         "taxInfo" : null,
         "success" : true
       }
    """

  val salesforceAccountId = "001g000001gPmXdAAK"
  val salesforceId = "003g000001UtkrEAAR"
  val identityId = "30000311"
  val paymentGateway = "Stripe Gateway 1"
  val tokenId = "card_Aaynm1dIeDH1zp"
  val secondTokenId = "cus_AaynKIp19IIGDz"
  val cardNumber = "4242"
  val payPalBaid = "B-23637766K5365543J"

  val date = new LocalDate(2017, 5, 4)

  def account(currency: Currency = GBP, paymentGateway: PaymentGateway = StripeGateway) = Account(salesforceAccountId, currency, salesforceAccountId, salesforceId, identityId, paymentGateway)

  val contactDetails = ContactDetails("Test-FirstName", "Test-LastName", "test@gu.com", Country.UK)
  val creditCardPaymentMethod = CreditCardReferenceTransaction(tokenId, secondTokenId, cardNumber, Some(Country.UK), 12, 22, "AmericanExpress")
  val payPalPaymentMethod = PayPalReferenceTransaction(payPalBaid, "test@paypal.com")
  val directDebitPaymentMethod = DirectDebitPaymentMethod("Barry", "Humphreys", "Barry Humphreys", "200000", "55779911")

  val config = Configuration.zuoraConfigProvider.get()
  val monthlySubscriptionData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(config.monthlyContribution.productRatePlanId), //Contribution product
        List(RatePlanChargeData(
          RatePlanCharge(config.monthlyContribution.productRatePlanChargeId, Some(25: BigDecimal))
        )),
        Nil
      )
    ),
    Subscription(date, date, date)
  )

  def creditCardSubscriptionRequest(currency: Currency = GBP) = SubscribeRequest(List(SubscribeItem(account(currency), contactDetails, creditCardPaymentMethod, monthlySubscriptionData, SubscribeOptions())))

  def directDebitSubscriptionRequest = SubscribeRequest(List(SubscribeItem(account(paymentGateway = DirectDebitGateway), contactDetails, directDebitPaymentMethod, monthlySubscriptionData, SubscribeOptions())))

  val invalidMonthlySubsData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(config.monthlyContribution.productRatePlanId),
        List(RatePlanChargeData(
          RatePlanCharge(config.monthlyContribution.productRatePlanChargeId, Some(5: BigDecimal))
        )),
        Nil
      )
    ),
    Subscription(date, date, date, termType = "Invalid term type")
  )
  val invalidSubscriptionRequest = SubscribeRequest(List(
    SubscribeItem(account(), contactDetails, creditCardPaymentMethod, invalidMonthlySubsData, SubscribeOptions())
  ))

  val incorrectPaymentMethod = SubscribeRequest(List(SubscribeItem(account(), contactDetails, payPalPaymentMethod, invalidMonthlySubsData, SubscribeOptions())))

  val invoiceResult =
    """
      {
        "Invoice": [
          {
            "InvoiceNumber": "INV00051836",
            "Id": "2c92c0f85be67835015be751f2c6655e"
          }
        ]
      }
    """

  val subscribeResponseAccount =
    s"""
        {
          "AccountNumber": "A00015771",
          "SubscriptionNumber": "A-S00043097",
          "GatewayResponse": "Payment complete.",
          "PaymentId": "2c92c0f85be67835015be751f3286569",
          "InvoiceResult": $invoiceResult,
          "TotalTcv": 60,
          "SubscriptionId": "2c92c0f85be67835015be751f24a6550",
          "Success": true,
          "TotalMrr": 5,
          "PaymentTransactionNumber": "ch_AcMack4JjPKuw6",
          "AccountId": "2c92c0f85be67835015be751f1d8654c",
          "GatewayResponseCode": "Approved",
          "InvoiceNumber": "INV00051836",
          "InvoiceId": "2c92c0f85be67835015be751f2c6655e"
        }
    """
  val subscribeResponse =
    s"""
      [
        $subscribeResponseAccount
      ]
    """
  val subscribeResponseAnnual =
    """
     [
        {
          "AccountNumber": "A00016540",
          "SubscriptionNumber": "A-S00043802",
          "GatewayResponse": "Approved",
          "PaymentId": "2c92c0f95e1d5ca3015e38e585f339dc",
          "InvoiceResult": {
            "Invoice": [
              {
                "InvoiceNumber": "INV00052447",
                "Id": "2c92c0f95e1d5ca3015e38e585b539d1"
              }
            ]
          },
          "TotalTcv": 150,
          "SubscriptionId": "2c92c0f95e1d5ca3015e38e5854739c3",
          "Success": true,
          "TotalMrr": 12.5,
          "PaymentTransactionNumber": "18X93788F8464761C",
          "AccountId": "2c92c0f95e1d5ca3015e38e583c739bd",
          "GatewayResponseCode": "Approved",
          "InvoiceNumber": "INV00052447",
          "InvoiceId": "2c92c0f95e1d5ca3015e38e585b539d1"
        }
      ]
   """
  val error =
    """
      {
        "Code": "53100320",
        "Message": "'termType' value should be one of: TERMED, EVERGREEN"
      }
    """

  val errorResponse =
    s"""
        [
          {
            "Errors": [
              {
                "Code": "MISSING_REQUIRED_VALUE",
                "Message": "SubscriptionData.SubscriptionRatePlanData[0].ProductRatePlanId is invalid."
              }
            ],
            "Success": false
          }
        ]
     """

  val directDebitPaymentFieldsJson =
    s"""
       {
        "accountHolderName": "Mickey Mouse",
        "sortCode": "204532",
        "accountNumber": "37462947"
       }
     """
}