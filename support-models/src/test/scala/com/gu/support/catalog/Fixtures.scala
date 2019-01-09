package com.gu.support.catalog

import scala.io.Source

object Fixtures {
  def loadCatalog = Source.fromURL(getClass.getResource("/catalog.json")).mkString
  def loadMinCatalog = Source.fromURL(getClass.getResource("/catalogMin.json")).mkString
  val digitalPackJson =
    """
        {
                    "id": "2c92a0fb4edd70c8014edeaa4e972204",
                    "status": "Active",
                    "name": "Digital Pack Annual",
                    "description": "",
                    "effectiveStartDate": "2013-03-11",
                    "effectiveEndDate": "2020-03-12",
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
                                "USD199.9",
                                "NZD235",
                                "EUR149.9",
                                "GBP119.9",
                                "CAD219.5",
                                "AUD215"
                            ],
                            "pricing": [
                                {
                                    "currency": "USD",
                                    "price": 199.9,
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
                                    "price": 149.9,
                                    "tiers": null,
                                    "includedUnits": null,
                                    "overagePrice": null,
                                    "discountPercentage": null,
                                    "discountAmount": null
                                },
                                {
                                    "currency": "GBP",
                                    "price": 119.9,
                                    "tiers": null,
                                    "includedUnits": null,
                                    "overagePrice": null,
                                    "discountPercentage": null,
                                    "discountAmount": null
                                },
                                {
                                    "currency": "CAD",
                                    "price": 219.5,
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
                            "revenueRecognitionRuleName": "Recognize daily over time",
                            "useDiscountSpecificAccountingCode": null,
                            "financeInformation": {
                                "recognizedRevenueAccountingCode": "Digital Pack",
                                "recognizedRevenueAccountingCodeType": "SalesRevenue",
                                "deferredRevenueAccountingCode": "Deferred Revenue - Digital Pack",
                                "deferredRevenueAccountingCodeType": "DeferredRevenue"
                            }
                        }
                    ]
                }
      """
}
