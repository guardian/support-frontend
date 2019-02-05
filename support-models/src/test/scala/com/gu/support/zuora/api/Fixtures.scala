package com.gu.support.zuora.api

import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.support.workers.{CreditCardReferenceTransaction, DirectDebitPaymentMethod, PayPalReferenceTransaction}
import com.gu.support.workers.{DirectDebitPaymentMethod, PayPalReferenceTransaction}
import org.joda.time.LocalDate

//noinspection TypeAnnotation
object Fixtures {
  val accountNumber = "A00071408"
  val promoCode = "TEST_CODE"

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

  def account(
    currency: Currency = GBP,
    paymentGateway: PaymentGateway = StripeGatewayDefault
  ): Account = Account(
    salesforceAccountId,
    currency,
    salesforceAccountId,
    salesforceId,
    identityId,
    paymentGateway,
    "createdreqid_hi"
  )

  val contactDetails = ContactDetails("Test-FirstName", "Test-LastName", "test@gu.com", Country.UK)
  val creditCardPaymentMethod = CreditCardReferenceTransaction(tokenId, secondTokenId, cardNumber, Some(Country.UK), 12, 22, "AmericanExpress")
  val payPalPaymentMethod = PayPalReferenceTransaction(payPalBaid, "test@paypal.com")
  val directDebitPaymentMethod = DirectDebitPaymentMethod(
    firstName = "Barry",
    lastName = "Humphreys",
    bankTransferAccountName = "Barry Humphreys",
    bankCode = "200000", bankTransferAccountNumber = "55779911",
    city = Some("London"),
    postalCode = Some("abc 123"),
    state = None,
    streetName = Some("easy street"),
    streetNumber = None
  )
  val productRatePlanId = "12345"
  val productRatePlanChargeId = "67890"

  val subscription = Subscription(date, date, date, promoCode = Some(promoCode))
  val monthlySubscriptionData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(productRatePlanId), //Contribution product
        List(RatePlanChargeData(
          ContributionRatePlanCharge(productRatePlanChargeId, 25)
        )),
        Nil
      )
    ),
    subscription
  )

  val accountJson =
    """
      {
        "Name" : "001g000001gOR06AAG",
        "Currency" : "GBP",
        "CrmId" : "001g000001gOR06AAG",
        "sfContactId__c" : "003g000001UnFItAAN",
        "IdentityId__c" : "9999999",
        "PaymentGateway" : "Stripe Gateway 1",
        "CreatedRequestId__c" : "e18f6418-45f2-11e7-8bfa-8faac2182601",
        "BillCycleDay" : 0,
        "AutoPay" : true,
        "PaymentTerm" : "Due Upon Receipt",
        "BcdSettingOption" : "AutoSet",
        "Batch" : "Batch1"
      }
    """

  val subscriptionJson =
    s"""
      {
        "ContractEffectiveDate" : "2018-11-28",
        "ContractAcceptanceDate" : "2018-12-14",
        "TermStartDate" : "2018-11-28",
        "AutoRenew" : true,
        "InitialTerm" : 12,
        "RenewalTerm" : 12,
        "TermType" : "TERMED",
        "InitialPromotionCode__c": "$promoCode",
        "PromotionCode__c": "$promoCode"
      }
    """

  val subscribeItemJson =
    s"""
      {
        "Account" : $accountJson,
        "BillToContact" : {
          "FirstName" : "test",
          "LastName" : "user",
          "WorkEmail" : "yjcysqxfcqqytuzupjc@gu.com",
          "Country" : "GB",
          "Address1" : null,
          "Address2" : null,
          "City" : null,
          "PostalCode" : null,
          "State" : null
        },
        "PaymentMethod" : {
          "TokenId" : "card_E0zitFfsO2wTEn",
          "SecondTokenId" : "cus_E0zic0cedDT5MZ",
          "CreditCardNumber" : "4242",
          "CreditCardCountry" : "US",
          "CreditCardExpirationMonth" : 2,
          "CreditCardExpirationYear" : 2022,
          "CreditCardType" : "Visa",
          "Type" : "CreditCardReferenceTransaction"
        },
        "SubscriptionData" : {
          "RatePlanData" : [
            {
              "RatePlan" : {
                "ProductRatePlanId" : "2c92c0f94bbffaaa014bc6a4212e205b"
              },
              "RatePlanChargeData" : [
              ],
              "SubscriptionProductFeatureList" : [
              ]
            }
          ],
          "Subscription" : $subscriptionJson
        },
        "SubscribeOptions" : {
          "GenerateInvoice" : true,
          "ProcessPayments" : true
        }
      }
    """
  val subscribeRequestJson =
    s"""
      {
        "subscribes": [$subscribeItemJson]
      }
    """

  def creditCardSubscriptionRequest(currency: Currency = GBP): SubscribeRequest =
    SubscribeRequest(List(
      SubscribeItem(account(currency), contactDetails, creditCardPaymentMethod, monthlySubscriptionData, SubscribeOptions())
    ))

  def directDebitSubscriptionRequest: SubscribeRequest =
    SubscribeRequest(List(
      SubscribeItem(account(paymentGateway = DirectDebitGateway), contactDetails, directDebitPaymentMethod, monthlySubscriptionData, SubscribeOptions())
    ))

  val invalidMonthlySubsData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(productRatePlanId),
        List(RatePlanChargeData(
          ContributionRatePlanCharge(productRatePlanChargeId, 5)
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
          "SubscriptionId": "2c92c0f86716797001671754520357f2",
          "SubscriptionNumber": "A-S00047037",
          "TotalMrr": 9.991666667,
          "AccountId": "2c92c0f867167970016717544fd357e9",
          "AccountNumber": "A00019554",
          "Success": true,
          "TotalTcv": 115.387634411
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

  val contributionRatePlanCharge =
    """
    {
      "ProductRatePlanChargeId" : "12345",
      "Price" : 15,
      "EndDateCondition" : "SubscriptionEnd"
    }
    """
}
