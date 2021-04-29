package com.gu.support.workers.lambdas

import com.gu.support.catalog.{CatalogService, SimpleJsonProvider}
import com.gu.support.config.TouchPointEnvironments.PROD
import com.gu.support.workers.lambdas.UpdateSupporterProductDataSpec.{digitalSusbcriptionGiftState, serviceWithFixtures}
import com.gu.support.workers.states.SendThankYouEmailState
import io.circe.parser._
import org.scalatest.Inside.inside
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers.convertToAnyShouldWrapper

class UpdateSupporterProductDataSpec extends AnyFlatSpec {

  "UpdateSupporterProductData" should "not insert an item into Dynamo for a digisub gift purchase" in {
    val state = decode[SendThankYouEmailState](digitalSusbcriptionGiftState)
    state.isRight shouldBe true
    val supporterRatePlanItem =  UpdateSupporterProductData
      .getSupporterRatePlanItemFromState(state.toOption.get, serviceWithFixtures)
    inside(supporterRatePlanItem) {
      case Right(value) => value shouldBe None
    }
  }
}

object UpdateSupporterProductDataSpec {

  val digitalSusbcriptionGiftState = """
    {
      "user": {
        "id": "100569339",
        "primaryEmailAddress": "sdflkjsd@sflk.com",
        "title": null,
        "firstName": "Foo",
        "lastName": "Bar",
        "billingAddress": {
          "lineOne": "PO Box 7242",
          "lineTwo": null,
          "city": "Kin Kora",
          "state": "QLD",
          "postCode": "4680",
          "country": "AU"
        },
        "deliveryAddress": null,
        "telephoneNumber": "+61414422571",
        "allowMembershipMail": false,
        "allowThirdPartyMail": false,
        "allowGURelatedMail": false,
        "isTestUser": false,
        "deliveryInstructions": null
      },
      "recipientSFContactId": "0035I00000J60mJQAR",
      "product": {
        "currency": "AUD",
        "billingPeriod": "Annual",
        "readerType": "Gift",
        "productType": "DigitalPack"
      },
      "giftRecipient": {
        "firstName": "Hugh",
        "lastName": "Bridge",
        "email": "cqdlap@bigpond.com",
        "message": "Happy Birthday\nHours of happy reading.  Your antidote to the Courier Mail",
        "deliveryDate": "2021-05-01",
        "giftRecipientType": "DigitalSubscription"
      },
      "giftCode": "gd12-on9vztmx",
      "lastRedemptionDate": "2022-04-28",
      "paymentMethod": {
        "TokenId": "pm_1IlOnvA6jk3EqdymmoiDUSru",
        "SecondTokenId": "cus_JOBAjupodX3MDO",
        "CreditCardNumber": "0335",
        "CreditCardCountry": "AU",
        "CreditCardExpirationMonth": 3,
        "CreditCardExpirationYear": 2024,
        "CreditCardType": "MasterCard",
        "PaymentGateway": "Stripe PaymentIntents GNM Membership AUS",
        "Type": "CreditCardReferenceTransaction",
        "StripePaymentType": "StripeCheckout"
      },
      "paymentSchedule": {
        "payments": [
          {
            "date": "2021-04-29",
            "amount": 175
          }
        ]
      },
      "promoCode": null,
      "accountNumber": "A01383991",
      "subscriptionNumber": "A-S01429225",
      "productType": "DigitalSubscriptionGiftPurchase"
    }
  """

  val catalog = """
  {
  "products": [
    {
        "id": "2c92a0fb4edd70c8014edeaa4ddb21e7",
        "sku": "ABC-00000005",
        "name": "Digital Pack",
        "description": "The Guardian & Observer Digital Pack gives you 7-day access to the Guardian & Observer daily edition for iPad, Android tablet and Kindle Fire as well as premium tier access to the iOS and Android live news apps.",
        "category": null,
        "effectiveStartDate": "2013-02-16",
        "effectiveEndDate": "2099-02-03",
        "allowFeatureChanges": false,
        "ProductEnabled__c": "True",
        "Entitlements__c": null,
        "AcquisitionProfile__c": "Paid",
        "ProductType__c": "Digital Pack",
        "ProductLevel__c": null,
        "Tier__c": null,
        "productRatePlans": [
            {
                "id": "2c92a00773adc09d0173b99e4ded7f45",
                "status": "Active",
                "name": "Digital Subscription One Year Fixed - Deprecated",
                "description": "",
                "effectiveStartDate": "2020-08-01",
                "effectiveEndDate": "2099-01-01",
                "TermType__c": null,
                "FrontendId__c": "One Year",
                "Saving__c": null,
                "DefaultTerm__c": "12",
                "RatePlanType__c": "Base",
                "PromotionCode__c": null,
                "productRatePlanCharges": [
                    {
                        "id": "2c92a00d73add0220173b9a387c62aec",
                        "name": "Digital Subscription One Year Fixed",
                        "type": "Recurring",
                        "model": "FlatFee",
                        "uom": null,
                        "pricingSummary": [
                            "USD165",
                            "NZD175",
                            "EUR125",
                            "GBP99",
                            "CAD175",
                            "AUD175"
                        ],
                        "pricing": [
                            {
                                "currency": "USD",
                                "price": 165,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "NZD",
                                "price": 175,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "EUR",
                                "price": 125,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "GBP",
                                "price": 99,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "CAD",
                                "price": 175,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "AUD",
                                "price": 175,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            }
                        ],
                        "chargeModelConfigurations": [],
                        "defaultQuantity": null,
                        "applyDiscountTo": null,
                        "discountLevel": null,
                        "discountClass": null,
                        "productDiscountApplyDetails": [],
                        "endDateCondition": "Subscription_End",
                        "upToPeriods": null,
                        "upToPeriodsType": null,
                        "billingDay": "ChargeTriggerDay",
                        "listPriceBase": "Per_Billing_Period",
                        "billingTiming": "IN_ADVANCE",
                        "billingPeriod": "Annual",
                        "billingPeriodAlignment": "AlignToTermStart",
                        "specificBillingPeriod": null,
                        "smoothingModel": null,
                        "numberOfPeriods": null,
                        "overageCalculationOption": null,
                        "overageUnusedUnitsCreditOption": null,
                        "unusedIncludedUnitPrice": null,
                        "usageRecordRatingOption": null,
                        "priceChangeOption": null,
                        "priceIncreasePercentage": null,
                        "useTenantDefaultForPriceChange": true,
                        "taxable": true,
                        "taxCode": "Digital Pack Global Tax",
                        "taxMode": "TaxInclusive",
                        "ProductType__c": "Digital Pack",
                        "triggerEvent": "CustomerAcceptance",
                        "description": "",
                        "revRecCode": null,
                        "revRecTriggerCondition": null,
                        "revenueRecognitionRuleName": "Digital Subscription Gift Rule",
                        "useDiscountSpecificAccountingCode": null,
                        "financeInformation": {
                            "deferredRevenueAccountingCode": "Deferred Revenue - Digital Pack",
                            "deferredRevenueAccountingCodeType": "DeferredRevenue",
                            "recognizedRevenueAccountingCode": "Digital Pack",
                            "recognizedRevenueAccountingCodeType": "SalesRevenue"
                        }
                    }
                ]
            },
            {
                "id": "2c92a00c77992ba70177a6596f710265",
                "status": "Active",
                "name": "Digital Subscription One Year Fixed - One Time Charge",
                "description": "",
                "effectiveStartDate": "2020-08-01",
                "effectiveEndDate": "2099-01-01",
                "TermType__c": null,
                "FrontendId__c": "One Year",
                "Saving__c": null,
                "DefaultTerm__c": "12",
                "RatePlanType__c": "Base",
                "PromotionCode__c": null,
                "productRatePlanCharges": [
                    {
                        "id": "2c92a011779932fd0177a670f43102aa",
                        "name": "Digital Subscription One Year Fixed - One Time Charge",
                        "type": "OneTime",
                        "model": "FlatFee",
                        "uom": null,
                        "pricingSummary": [
                            "USD165",
                            "NZD175",
                            "EUR125",
                            "GBP99",
                            "CAD175",
                            "AUD175"
                        ],
                        "pricing": [
                            {
                                "currency": "USD",
                                "price": 165,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "NZD",
                                "price": 175,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "EUR",
                                "price": 125,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "GBP",
                                "price": 99,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "CAD",
                                "price": 175,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "AUD",
                                "price": 175,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            }
                        ],
                        "chargeModelConfigurations": [],
                        "defaultQuantity": null,
                        "applyDiscountTo": null,
                        "discountLevel": null,
                        "discountClass": null,
                        "productDiscountApplyDetails": [],
                        "endDateCondition": "One_Time",
                        "upToPeriods": null,
                        "upToPeriodsType": null,
                        "billingDay": null,
                        "listPriceBase": null,
                        "billingTiming": null,
                        "billingPeriod": null,
                        "billingPeriodAlignment": null,
                        "specificBillingPeriod": null,
                        "smoothingModel": null,
                        "numberOfPeriods": null,
                        "overageCalculationOption": null,
                        "overageUnusedUnitsCreditOption": null,
                        "unusedIncludedUnitPrice": null,
                        "usageRecordRatingOption": null,
                        "priceChangeOption": null,
                        "priceIncreasePercentage": null,
                        "useTenantDefaultForPriceChange": null,
                        "taxable": true,
                        "taxCode": "Digital Pack Global Tax",
                        "taxMode": "TaxInclusive",
                        "ProductType__c": "Digital Pack",
                        "triggerEvent": "CustomerAcceptance",
                        "description": "",
                        "revRecCode": null,
                        "revRecTriggerCondition": null,
                        "revenueRecognitionRuleName": "Digital Subscription Gift Rule",
                        "useDiscountSpecificAccountingCode": null,
                        "financeInformation": {
                            "deferredRevenueAccountingCode": "Deferred Revenue - Digital Pack",
                            "deferredRevenueAccountingCodeType": "DeferredRevenue",
                            "recognizedRevenueAccountingCode": "Digital Pack",
                            "recognizedRevenueAccountingCodeType": "SalesRevenue"
                        }
                    }
                ]
            },
            {
                "id": "2c92a0ff73add07f0173b99f14390afc",
                "status": "Active",
                "name": "Digital Subscription Three Month Fixed - Deprecated",
                "description": "",
                "effectiveStartDate": "2020-08-01",
                "effectiveEndDate": "2099-01-01",
                "TermType__c": null,
                "FrontendId__c": "Three Month",
                "Saving__c": null,
                "DefaultTerm__c": "12",
                "RatePlanType__c": "Base",
                "PromotionCode__c": null,
                "productRatePlanCharges": [
                    {
                        "id": "2c92a0ff73add07f0173b9a80a584466",
                        "name": "Digital Subscription Three Month Fixed",
                        "type": "Recurring",
                        "model": "FlatFee",
                        "uom": null,
                        "pricingSummary": [
                            "USD60",
                            "NZD63",
                            "EUR45",
                            "GBP36",
                            "CAD63",
                            "AUD63"
                        ],
                        "pricing": [
                            {
                                "currency": "USD",
                                "price": 60,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "NZD",
                                "price": 63,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "EUR",
                                "price": 45,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "GBP",
                                "price": 36,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "CAD",
                                "price": 63,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "AUD",
                                "price": 63,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            }
                        ],
                        "chargeModelConfigurations": [],
                        "defaultQuantity": null,
                        "applyDiscountTo": null,
                        "discountLevel": null,
                        "discountClass": null,
                        "productDiscountApplyDetails": [],
                        "endDateCondition": "Subscription_End",
                        "upToPeriods": null,
                        "upToPeriodsType": null,
                        "billingDay": "ChargeTriggerDay",
                        "listPriceBase": "Per_Billing_Period",
                        "billingTiming": "IN_ADVANCE",
                        "billingPeriod": "Quarter",
                        "billingPeriodAlignment": "AlignToTermStart",
                        "specificBillingPeriod": null,
                        "smoothingModel": null,
                        "numberOfPeriods": null,
                        "overageCalculationOption": null,
                        "overageUnusedUnitsCreditOption": null,
                        "unusedIncludedUnitPrice": null,
                        "usageRecordRatingOption": null,
                        "priceChangeOption": null,
                        "priceIncreasePercentage": null,
                        "useTenantDefaultForPriceChange": true,
                        "taxable": true,
                        "taxCode": "Digital Pack Global Tax",
                        "taxMode": "TaxInclusive",
                        "ProductType__c": "Digital Pack",
                        "triggerEvent": "CustomerAcceptance",
                        "description": "",
                        "revRecCode": null,
                        "revRecTriggerCondition": null,
                        "revenueRecognitionRuleName": "Digital Subscription Gift Rule",
                        "useDiscountSpecificAccountingCode": null,
                        "financeInformation": {
                            "deferredRevenueAccountingCode": "Deferred Revenue - Digital Pack",
                            "deferredRevenueAccountingCodeType": "DeferredRevenue",
                            "recognizedRevenueAccountingCode": "Digital Pack",
                            "recognizedRevenueAccountingCodeType": "SalesRevenue"
                        }
                    }
                ]
            },
            {
                "id": "2c92a00d779932ef0177a65430d30ac1",
                "status": "Active",
                "name": "Digital Subscription Three Month Fixed - One Time Charge",
                "description": "",
                "effectiveStartDate": "2020-08-01",
                "effectiveEndDate": "2099-01-01",
                "TermType__c": null,
                "FrontendId__c": "Three Month",
                "Saving__c": null,
                "DefaultTerm__c": "12",
                "RatePlanType__c": "Base",
                "PromotionCode__c": null,
                "productRatePlanCharges": [
                    {
                        "id": "2c92a00f779933030177a65881490325",
                        "name": "Digital Subscription Three Month Fixed - One Time Charge",
                        "type": "OneTime",
                        "model": "FlatFee",
                        "uom": null,
                        "pricingSummary": [
                            "USD60",
                            "NZD63",
                            "EUR45",
                            "GBP36",
                            "CAD63",
                            "AUD63"
                        ],
                        "pricing": [
                            {
                                "currency": "USD",
                                "price": 60,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "NZD",
                                "price": 63,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "EUR",
                                "price": 45,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "GBP",
                                "price": 36,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "CAD",
                                "price": 63,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "AUD",
                                "price": 63,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            }
                        ],
                        "chargeModelConfigurations": [],
                        "defaultQuantity": null,
                        "applyDiscountTo": null,
                        "discountLevel": null,
                        "discountClass": null,
                        "productDiscountApplyDetails": [],
                        "endDateCondition": "One_Time",
                        "upToPeriods": null,
                        "upToPeriodsType": null,
                        "billingDay": null,
                        "listPriceBase": null,
                        "billingTiming": null,
                        "billingPeriod": null,
                        "billingPeriodAlignment": null,
                        "specificBillingPeriod": null,
                        "smoothingModel": null,
                        "numberOfPeriods": null,
                        "overageCalculationOption": null,
                        "overageUnusedUnitsCreditOption": null,
                        "unusedIncludedUnitPrice": null,
                        "usageRecordRatingOption": null,
                        "priceChangeOption": null,
                        "priceIncreasePercentage": null,
                        "useTenantDefaultForPriceChange": null,
                        "taxable": true,
                        "taxCode": "Digital Pack Global Tax",
                        "taxMode": "TaxInclusive",
                        "ProductType__c": "Digital Pack",
                        "triggerEvent": "CustomerAcceptance",
                        "description": "",
                        "revRecCode": null,
                        "revRecTriggerCondition": null,
                        "revenueRecognitionRuleName": "Digital Subscription Gift Rule",
                        "useDiscountSpecificAccountingCode": null,
                        "financeInformation": {
                            "deferredRevenueAccountingCode": "Deferred Revenue - Digital Pack",
                            "deferredRevenueAccountingCodeType": "DeferredRevenue",
                            "recognizedRevenueAccountingCode": "Digital Pack",
                            "recognizedRevenueAccountingCodeType": "SalesRevenue"
                        }
                    }
                ]
            },
            {
                "id": "2c92a00d71c96bac0171df3a5622740f",
                "status": "Active",
                "name": "Corporate Digital Subscription",
                "description": "",
                "effectiveStartDate": "2020-01-01",
                "effectiveEndDate": "2050-01-01",
                "TermType__c": "TERMED",
                "FrontendId__c": null,
                "Saving__c": null,
                "DefaultTerm__c": "12",
                "RatePlanType__c": "Base",
                "PromotionCode__c": null,
                "productRatePlanCharges": [
                    {
                        "id": "2c92a00871c96ba30171df3b481931a0",
                        "name": "Corporate Digital Subscription",
                        "type": "OneTime",
                        "model": "FlatFee",
                        "uom": null,
                        "pricingSummary": [
                            "USD0",
                            "NZD0",
                            "EUR0",
                            "GBP0",
                            "CAD0",
                            "AUD0"
                        ],
                        "pricing": [
                            {
                                "currency": "USD",
                                "price": 0,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "NZD",
                                "price": 0,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "EUR",
                                "price": 0,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "GBP",
                                "price": 0,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "CAD",
                                "price": 0,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "AUD",
                                "price": 0,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            }
                        ],
                        "chargeModelConfigurations": [],
                        "defaultQuantity": null,
                        "applyDiscountTo": null,
                        "discountLevel": null,
                        "discountClass": null,
                        "productDiscountApplyDetails": [],
                        "endDateCondition": "One_Time",
                        "upToPeriods": null,
                        "upToPeriodsType": null,
                        "billingDay": null,
                        "listPriceBase": null,
                        "billingTiming": null,
                        "billingPeriod": null,
                        "billingPeriodAlignment": null,
                        "specificBillingPeriod": null,
                        "smoothingModel": null,
                        "numberOfPeriods": null,
                        "overageCalculationOption": null,
                        "overageUnusedUnitsCreditOption": null,
                        "unusedIncludedUnitPrice": null,
                        "usageRecordRatingOption": null,
                        "priceChangeOption": null,
                        "priceIncreasePercentage": null,
                        "useTenantDefaultForPriceChange": null,
                        "taxable": false,
                        "taxCode": "",
                        "taxMode": "TaxExclusive",
                        "ProductType__c": "Digital Pack",
                        "triggerEvent": "ContractEffective",
                        "description": "",
                        "revRecCode": null,
                        "revRecTriggerCondition": null,
                        "revenueRecognitionRuleName": "Recognize upon invoicing",
                        "useDiscountSpecificAccountingCode": null,
                        "financeInformation": {
                            "deferredRevenueAccountingCode": "Digital Pack",
                            "deferredRevenueAccountingCodeType": "SalesRevenue",
                            "recognizedRevenueAccountingCode": "Digital Pack",
                            "recognizedRevenueAccountingCodeType": "SalesRevenue"
                        }
                    }
                ]
            },
            {
                "id": "2c92a0fb4edd70c8014edeaa4e8521fe",
                "status": "Active",
                "name": "Digital Pack Quarterly",
                "description": "",
                "effectiveStartDate": "2013-03-11",
                "effectiveEndDate": "2099-01-12",
                "TermType__c": null,
                "FrontendId__c": "Quarterly",
                "Saving__c": null,
                "DefaultTerm__c": "12",
                "RatePlanType__c": "Base",
                "PromotionCode__c": null,
                "productRatePlanCharges": [
                    {
                        "id": "2c92a0fb4edd70c9014edeaa4fd42186",
                        "name": "Digital Pack Quarterly",
                        "type": "Recurring",
                        "model": "FlatFee",
                        "uom": null,
                        "pricingSummary": [
                            "USD59.95",
                            "NZD70.5",
                            "EUR44.95",
                            "GBP35.95",
                            "CAD65.85",
                            "AUD64.5"
                        ],
                        "pricing": [
                            {
                                "currency": "USD",
                                "price": 59.95,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "NZD",
                                "price": 70.5,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "EUR",
                                "price": 44.95,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "GBP",
                                "price": 35.95,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "CAD",
                                "price": 65.85,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "AUD",
                                "price": 64.5,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            }
                        ],
                        "chargeModelConfigurations": [],
                        "defaultQuantity": null,
                        "applyDiscountTo": null,
                        "discountLevel": null,
                        "discountClass": null,
                        "productDiscountApplyDetails": [],
                        "endDateCondition": "Subscription_End",
                        "upToPeriods": null,
                        "upToPeriodsType": null,
                        "billingDay": "ChargeTriggerDay",
                        "listPriceBase": "Per_Billing_Period",
                        "billingTiming": "IN_ADVANCE",
                        "billingPeriod": "Quarter",
                        "billingPeriodAlignment": "AlignToTermStart",
                        "specificBillingPeriod": null,
                        "smoothingModel": null,
                        "numberOfPeriods": null,
                        "overageCalculationOption": null,
                        "overageUnusedUnitsCreditOption": null,
                        "unusedIncludedUnitPrice": null,
                        "usageRecordRatingOption": null,
                        "priceChangeOption": null,
                        "priceIncreasePercentage": null,
                        "useTenantDefaultForPriceChange": true,
                        "taxable": true,
                        "taxCode": "Digital Pack Global Tax",
                        "taxMode": "TaxInclusive",
                        "ProductType__c": "Digital Pack",
                        "triggerEvent": "CustomerAcceptance",
                        "description": "",
                        "revRecCode": null,
                        "revRecTriggerCondition": null,
                        "revenueRecognitionRuleName": "Recognize daily over time",
                        "useDiscountSpecificAccountingCode": null,
                        "financeInformation": {
                            "deferredRevenueAccountingCode": "Deferred Revenue - Digital Pack",
                            "deferredRevenueAccountingCodeType": "DeferredRevenue",
                            "recognizedRevenueAccountingCode": "Digital Pack",
                            "recognizedRevenueAccountingCodeType": "SalesRevenue"
                        }
                    }
                ]
            },
            {
                "id": "2c92a0fb4edd70c8014edeaa4e972204",
                "status": "Active",
                "name": "Digital Pack Annual",
                "description": "",
                "effectiveStartDate": "2013-03-11",
                "effectiveEndDate": "2099-01-12",
                "TermType__c": null,
                "FrontendId__c": "Yearly",
                "Saving__c": null,
                "DefaultTerm__c": "12",
                "RatePlanType__c": "Base",
                "PromotionCode__c": null,
                "productRatePlanCharges": [
                    {
                        "id": "2c92a0fb4edd70c9014edeaa5001218c",
                        "name": "Digital Pack Annual",
                        "type": "Recurring",
                        "model": "FlatFee",
                        "uom": null,
                        "pricingSummary": [
                            "USD199",
                            "NZD235",
                            "EUR149",
                            "GBP119",
                            "CAD219",
                            "AUD215"
                        ],
                        "pricing": [
                            {
                                "currency": "USD",
                                "price": 199,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "NZD",
                                "price": 235,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "EUR",
                                "price": 149,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "GBP",
                                "price": 119,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "CAD",
                                "price": 219,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "AUD",
                                "price": 215,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            }
                        ],
                        "chargeModelConfigurations": [],
                        "defaultQuantity": null,
                        "applyDiscountTo": null,
                        "discountLevel": null,
                        "discountClass": null,
                        "productDiscountApplyDetails": [],
                        "endDateCondition": "Subscription_End",
                        "upToPeriods": null,
                        "upToPeriodsType": null,
                        "billingDay": "ChargeTriggerDay",
                        "listPriceBase": "Per_Billing_Period",
                        "billingTiming": "IN_ADVANCE",
                        "billingPeriod": "Annual",
                        "billingPeriodAlignment": "AlignToTermStart",
                        "specificBillingPeriod": null,
                        "smoothingModel": null,
                        "numberOfPeriods": null,
                        "overageCalculationOption": null,
                        "overageUnusedUnitsCreditOption": null,
                        "unusedIncludedUnitPrice": null,
                        "usageRecordRatingOption": null,
                        "priceChangeOption": "NoChange",
                        "priceIncreasePercentage": null,
                        "useTenantDefaultForPriceChange": false,
                        "taxable": true,
                        "taxCode": "Digital Pack Global Tax",
                        "taxMode": "TaxInclusive",
                        "ProductType__c": "Digital Pack",
                        "triggerEvent": "CustomerAcceptance",
                        "description": "",
                        "revRecCode": null,
                        "revRecTriggerCondition": null,
                        "revenueRecognitionRuleName": "Recognize daily over time",
                        "useDiscountSpecificAccountingCode": null,
                        "financeInformation": {
                            "deferredRevenueAccountingCode": "Deferred Revenue - Digital Pack",
                            "deferredRevenueAccountingCodeType": "DeferredRevenue",
                            "recognizedRevenueAccountingCode": "Digital Pack",
                            "recognizedRevenueAccountingCodeType": "SalesRevenue"
                        }
                    }
                ]
            },
            {
                "id": "2c92a0fb4edd70c8014edeaa4eae220a",
                "status": "Active",
                "name": "Digital Pack Monthly",
                "description": "",
                "effectiveStartDate": "2013-03-11",
                "effectiveEndDate": "2099-01-12",
                "TermType__c": null,
                "FrontendId__c": "Monthly",
                "Saving__c": null,
                "DefaultTerm__c": "12",
                "RatePlanType__c": "Base",
                "PromotionCode__c": null,
                "productRatePlanCharges": [
                    {
                        "id": "2c92a0fb4edd70c9014edeaa50342192",
                        "name": "Digital Pack Monthly",
                        "type": "Recurring",
                        "model": "FlatFee",
                        "uom": null,
                        "pricingSummary": [
                            "USD19.99",
                            "NZD23.5",
                            "EUR14.99",
                            "GBP11.99",
                            "CAD21.95",
                            "AUD21.5"
                        ],
                        "pricing": [
                            {
                                "currency": "USD",
                                "price": 19.99,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "NZD",
                                "price": 23.5,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "EUR",
                                "price": 14.99,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "GBP",
                                "price": 11.99,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "CAD",
                                "price": 21.95,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            },
                            {
                                "currency": "AUD",
                                "price": 21.5,
                                "tiers": null,
                                "includedUnits": null,
                                "overagePrice": null,
                                "discountPercentage": null,
                                "discountAmount": null
                            }
                        ],
                        "chargeModelConfigurations": [],
                        "defaultQuantity": null,
                        "applyDiscountTo": null,
                        "discountLevel": null,
                        "discountClass": null,
                        "productDiscountApplyDetails": [],
                        "endDateCondition": "Subscription_End",
                        "upToPeriods": null,
                        "upToPeriodsType": null,
                        "billingDay": "ChargeTriggerDay",
                        "listPriceBase": "Per_Billing_Period",
                        "billingTiming": "IN_ADVANCE",
                        "billingPeriod": "Month",
                        "billingPeriodAlignment": "AlignToCharge",
                        "specificBillingPeriod": null,
                        "smoothingModel": null,
                        "numberOfPeriods": null,
                        "overageCalculationOption": null,
                        "overageUnusedUnitsCreditOption": null,
                        "unusedIncludedUnitPrice": null,
                        "usageRecordRatingOption": null,
                        "priceChangeOption": null,
                        "priceIncreasePercentage": null,
                        "useTenantDefaultForPriceChange": true,
                        "taxable": true,
                        "taxCode": "Digital Pack Global Tax",
                        "taxMode": "TaxInclusive",
                        "ProductType__c": "Digital Pack",
                        "triggerEvent": "CustomerAcceptance",
                        "description": "",
                        "revRecCode": null,
                        "revRecTriggerCondition": null,
                        "revenueRecognitionRuleName": "Recognize daily over time",
                        "useDiscountSpecificAccountingCode": null,
                        "financeInformation": {
                            "deferredRevenueAccountingCode": "Deferred Revenue - Digital Pack",
                            "deferredRevenueAccountingCodeType": "DeferredRevenue",
                            "recognizedRevenueAccountingCode": "Digital Pack",
                            "recognizedRevenueAccountingCodeType": "SalesRevenue"
                        }
                    }
                ]
            }
        ],
        "productFeatures": []
      }
    ]
  }
  """

  private val json = parse(catalog).toOption.get
  private val jsonProvider = new SimpleJsonProvider(json)
  val serviceWithFixtures = new CatalogService(PROD, jsonProvider)
}
