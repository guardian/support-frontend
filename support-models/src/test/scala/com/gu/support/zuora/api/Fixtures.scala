package com.gu.support.zuora.api

import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.support.workers.{
  CreditCardReferenceTransaction,
  DirectDebitPaymentMethod,
  PayPalReferenceTransaction,
  StripePaymentType,
}
import org.joda.time.LocalDate

//noinspection TypeAnnotation
object Fixtures {
  val accountNumber = "A00071408"
  val promoCode = "TEST_CODE"

  val soldToContact = s"""{
    "address1" : "Test",
    "address2" : "Test",
    "city" : "Test",
    "country" : "GB",
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
    "SpecialDeliveryInstructions__c" : "Stick it in the shed"
    }"""

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
         "soldToContact" : $soldToContact,
         "taxInfo" : null,
         "success" : true
       }
    """

  val salesforceAccountId = "0013E00001ASmI6QAL"
  val salesforceId = "0033E00001CpBZaQAN"
  val identityId = "30000311"
  val paymentGateway = "Stripe Gateway 1"
  val tokenId = "card_Aaynm1dIeDH1zp"
  val secondTokenId = "cus_AaynKIp19IIGDz"
  val cardNumber = "4242"
  val payPalBaid = "B-23637766K5365543J"

  val date = new LocalDate(2017, 5, 4)

  def account(
      currency: Currency = GBP,
      paymentGateway: PaymentGateway = StripeGatewayDefault,
  ): Account = Account(
    salesforceAccountId,
    currency,
    salesforceAccountId,
    salesforceId,
    identityId,
    Some(paymentGateway),
    "createdreqid_hi",
  )

  val deliveryInstructions = "Leave behind the dustbin"
  val contactDetails =
    ContactDetails(
      "Test-FirstName",
      "Test-LastName",
      Some("test@thegulocal.com"),
      Country.UK,
      deliveryInstructions = Some(deliveryInstructions),
    )
  val creditCardPaymentMethod = CreditCardReferenceTransaction(
    tokenId,
    secondTokenId,
    cardNumber,
    Some(Country.UK),
    12,
    22,
    Some("AmericanExpress"),
    StripeGatewayDefault,
    StripePaymentType = Some(StripePaymentType.StripeCheckout),
  )
  val payPalPaymentMethod = PayPalReferenceTransaction(payPalBaid, "test@paypal.com")
  val directDebitPaymentMethod = DirectDebitPaymentMethod(
    FirstName = "Barry",
    LastName = "Humphreys",
    BankTransferAccountName = "Barry Humphreys",
    BankCode = "200000",
    BankTransferAccountNumber = "55779911",
    City = Some("London"),
    PostalCode = Some("abc 123"),
    State = None,
    StreetName = Some("easy street"),
    StreetNumber = None,
  )
  val productRatePlanId = "12345"
  val productRatePlanChargeId = "67890"

  val subscription = Subscription(date, date, date, "id123", promoCode = Some(promoCode))
  val monthlySubscriptionData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(productRatePlanId), // Contribution product
        List(
          RatePlanChargeData(
            RatePlanChargeOverride(productRatePlanChargeId, 25),
          ),
        ),
        Nil,
      ),
    ),
    subscription,
  )

  val dsSubscriptionData = SubscriptionData(
    List(RatePlanData(RatePlan(productRatePlanId), Nil, Nil)),
    Subscription(
      contractEffectiveDate = new LocalDate(2020, 12, 1),
      contractAcceptanceDate = new LocalDate(2020, 12, 1),
      termStartDate = new LocalDate(2020, 12, 1),
      createdRequestId = "requestId",
      readerType = ReaderType.Direct,
      autoRenew = true,
      initialTerm = 12,
      initialTermPeriodType = Month,
      redemptionCode = None,
      giftNotificationEmailDate = None,
    ),
  )

  val dsGiftSubscriptionData = SubscriptionData(
    List(RatePlanData(RatePlan(productRatePlanId), Nil, Nil)),
    Subscription(
      contractEffectiveDate = new LocalDate(2020, 12, 1),
      contractAcceptanceDate = new LocalDate(2020, 12, 1),
      termStartDate = new LocalDate(2020, 12, 1),
      createdRequestId = "requestId",
      readerType = ReaderType.Gift,
      autoRenew = false,
      initialTerm = 3,
      initialTermPeriodType = Month,
      redemptionCode = Some("gd03-asdfghjq"),
      giftNotificationEmailDate = Some(new LocalDate(2020, 12, 25)),
    ),
  )

  val accountJson =
    """
      {
        "Name" : "0013E00001AU6xcQAD",
        "Currency" : "GBP",
        "CrmId" : "0013E00001AU6xcQAD",
        "sfContactId__c" : "0033E00001Cq8D2QAJ",
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
        "initialTermPeriodType": "Month",
        "RenewalTerm" : 12,
        "TermType" : "TERMED",
        "InitialPromotionCode__c": "$promoCode",
        "PromotionCode__c": "$promoCode",
        "CreatedRequestId__c": "id123",
        "ReaderType__c": "Direct"
      }
    """

  val subscribeItemJson =
    s"""
      {
        "Account" : $accountJson,
        "BillToContact" : {
          "FirstName" : "test",
          "LastName" : "user",
          "WorkEmail" : "yjcysqxfcqqytuzupjc@thegulocal.com",
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
          "CreditCardExpirationYear" : 2029,
          "CreditCardType" : "Visa",
          "Type" : "CreditCardReferenceTransaction",
          "paymentGateway": "Stripe Gateway 1"
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
    SubscribeRequest(
      List(
        SubscribeItem(
          account(currency),
          contactDetails,
          Some(contactDetails),
          Some(creditCardPaymentMethod),
          monthlySubscriptionData,
          SubscribeOptions(),
        ),
      ),
    )

  def directDebitSubscriptionRequest: SubscribeRequest =
    SubscribeRequest(
      List(
        SubscribeItem(
          account(paymentGateway = DirectDebitGateway),
          contactDetails,
          None,
          Some(directDebitPaymentMethod),
          monthlySubscriptionData,
          SubscribeOptions(),
        ),
      ),
    )

  val invalidMonthlySubsData = SubscriptionData(
    List(
      RatePlanData(
        RatePlan(productRatePlanId),
        List(
          RatePlanChargeData(
            RatePlanChargeOverride(productRatePlanChargeId, 5),
          ),
        ),
        Nil,
      ),
    ),
    Subscription(date, date, date, "id123", termType = "Invalid term type"),
  )
  val invalidSubscriptionRequest = SubscribeRequest(
    List(
      SubscribeItem(
        account(),
        contactDetails,
        None,
        Some(creditCardPaymentMethod),
        invalidMonthlySubsData,
        SubscribeOptions(),
      ),
    ),
  )

  val incorrectPaymentMethod = SubscribeRequest(
    List(
      SubscribeItem(
        account(),
        contactDetails,
        None,
        Some(payPalPaymentMethod),
        invalidMonthlySubsData,
        SubscribeOptions(),
      ),
    ),
  )

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

  val previewSubscribeResponseNoInvoice =
    """
      [
        {"Success":true,"TotalMrr":0,"TotalTcv":37.5}
      ]
   """

  val previewSubscribeResponseJson =
    """
      [
        {
            "Success": true,
            "InvoiceData": [
                {
                    "InvoiceItem": [
                        {
                            "ServiceEndDate": "2020-04-02",
                            "ServiceStartDate": "2020-01-03",
                            "TaxAmount": 0,
                            "ChargeAmount": 37.5
                        }
                    ]
                }
            ]
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
