package com.gu.support.promotions

object Fixtures {
  val startDate = "2018-10-03T00:00:00.000+01:00"

  val doublePromotionType =
    """
      {
          "a": {
              "amount": 50.03,
              "durationMonths": 3,
              "name": "percent_discount"
          },
          "b": {
              "duration": 14,
              "name": "free_trial"
          },
          "name": "double"
      }
    """
  val discountPromotion =
    s"""
    {
      "codes": {
          "Customer Experience": [
              "WAN82G"
          ]
      },
      "promotionType": {
          "amount": 30,
          "durationMonths": 12,
          "name": "percent_discount"
      },
      "name": "Urgent code to cover renewal 30% off",
      "appliesTo": {
          "productRatePlanIds": [
              "2c92a0ff58bdf4eb0158f2ecc89c1034",
              "2c92a0ff58bdf4eb0158f307ed0e02be",
              "2c92a0fd57d0a9870157d7412f19424f",
              "2c92a0ff58bdf4ee0158f30905e82181",
              "2c92a0ff58bdf4eb0158f307eccf02af",
              "2c92a0ff57d0a0b60157d741e722439a"
          ],
          "countries": [
              "AZ",
              "NF",
              "PW"
          ]
      },
      "description": "30% off standard Guardian Weekly renewal rate",
      "starts": "$startDate",
      "uuid": "b8992d84-dbd3-406c-b3c4-0209b74a66e9",
      "campaignCode": "C_IZY6K6ZY"
    }
  """

  val freeTrialPromotion =
    s"""
       {
            "codes": {
                "DISPLAY": [
                    "DP42A"
                ],
                "SEARCH": [
                    "DP41A"
                ],
                "SOCIAL": [
                    "DP43A"
                ],
                "House Ads": [
                    "DP52A"
                ],
                "MERCHANDISING": [
                    "DP51A"
                ],
                "EMAIL": [
                    "DP31A"
                ],
                "DEFAULT": [
                    "DP99X"
                ],
                "PRESS": [
                    "DP21A"
                ]
            },
            "promotionType": {
                "duration": 14,
                "name": "free_trial"
            },
            "expires": "2017-12-31T23:59:59.000+00:00",
            "name": "Channel tracking: 14-day free trial",
            "appliesTo": {
                "productRatePlanIds": [
                    "2c92a0fb4edd70c8014edeaa4eae220a",
                    "2c92a0fb4edd70c8014edeaa4e972204",
                    "2c92a0fb4edd70c8014edeaa4e8521fe"
                ],
                "countries": [
                    "AZ",
                    "NF"
                ]
            },
            "description": "14-day free trial",
            "starts": "2017-06-13T00:00:00.000+01:00",
            "uuid": "caddf8e4-89fc-4b3c-81b5-40f32617ea08",
            "campaignCode": "C_IOK1V0R4"
        }
     """

  val doublePromotion =
    s"""
    {
      "codes": {
          "Email": [
              "DAJ31A",
              "DAJ31E",
              "DAJ31C",
              "DAJ31J",
              "DAJ31I",
              "DAJ31D",
              "DAJ31F",
              "DAJ31B",
              "DAJ31H",
              "DAJ31G"
          ],
          "Paid Search": [
              "DAJ41X"
          ],
          "Paid Social": [
              "DAJ43X"
          ],
          "Paid Display": [
              "DAJ42X"
          ],
          "Subs Landing Page": [
              "DAJ80X"
          ],
          "Owned Display": [
              "DAJ52X"
          ],
          "Merchandising": [
              "DAJ51X"
          ],
          "Default": [
              "DAJ99X"
          ],
          "Telemarketing Outbound": [
              "DAJ12X"
          ],
          "Telemarketing Inbound": [
              "DAJ11X"
          ]
      },
      "promotionType": $doublePromotionType,
      "expires": "2017-06-30T23:59:59.000+01:00",
      "landingPage": {
          "roundelHtml": "### 50% off for 3 months",
          "description": "Enjoy the digital pack for half price.Subscribe before 30th June 2017 and get the Digital Pack for just £5.99 for the first 3 months (standard price of £11.99 a month will apply after).",
          "title": "Get 50% off the Guardian Digital Pack for 3 months",
          "type": "digitalpack",
          "sectionColour": "grey"
      },
      "name": "January 2017 | International | Trial + Discount",
      "appliesTo": {
          "productRatePlanIds": [
              "2c92a0fb4edd70c8014edeaa4eae220a",
              "2c92a0fb4edd70c8014edeaa4e8521fe",
              "2c92a0fb4edd70c8014edeaa4e972204"
          ],
          "countries": [
              "AZ",
              "NF",
              "PW",
              "HN",
              "CY",
              "GI"
          ]
      },
      "description": "50% off the standard price for three months",
      "starts": "2016-12-23T00:00:00.000+00:00",
      "uuid": "3c3bbc73-509e-4638-8eb3-df299241bd22",
      "campaignCode": "C_IWNMTUAC"
  }
    """

  val renewal =
    """
      {
            "codes": {
                "Email - SE2": [
                    "SV12E",
                    "SW12E",
                    "SX12E"
                ],
                "Letter - SL3": [
                    "SV12L",
                    "SW12L",
                    "SX12L"
                ]
            },
            "promotionType": {
                "name": "retention"
            },
            "name": "(+14) Student sub price; continuous, one-off 1, 2, 3 yr",
            "appliesTo": {
                "productRatePlanIds": [
                    "2c92a0ff58bdf4eb0158f2ecc89c1034",
                    "2c92a0fd57d0a9870157d7412f19424f",
                    "2c92a0fe57d0a0c40157d74240de5543",
                    "2c92a0fd58cf57000158f30ae6d06f2a",
                    "2c92a0fe57d0a0c40157d74241005544",
                    "2c92a0ff57d0a0b60157d741e722439a"
                ],
                "countries": [
                    "AZ",
                    "NF",
                    "AT"
                ]
            },
            "description": "25% off the standard rate for students",
            "starts": "2017-03-13T00:00:00.000+00:00",
            "uuid": "68d79637-a361-464a-b678-ed3596801034",
            "campaignCode": "C_J07YZU4G"
        }
    """

  val doubleWithRenewal =
    """
      {
            "codes": {
                "Carrier sheet": [
                    "GD04C",
                    "GD06C",
                    "GD07C"
                ]
            },
            "promotionType": {
                "a": {
                    "amount": 10,
                    "durationMonths": 12,
                    "name": "percent_discount"
                },
                "b": {
                    "name": "retention"
                },
                "name": "double"
            },
            "name": "10% off standard sub price on quarterly payments, standard sub price on one-off payment (1yr, 2yr, 3yr)",
            "appliesTo": {
                "productRatePlanIds": [
                    "2c92a0fd57d0a9870157d7412f19424f",
                    "2c92a0fe57d0a0c40157d74241005544"
                ],
                "countries": [
                    "AZ",
                    "NF",
                    "AT"
                ]
            },
            "description": "Save 10% when you switch to regular quarterly payments",
            "starts": "2016-12-21T00:00:00.000+00:00",
            "uuid": "54311fb2-f11d-4c53-ba43-e5a97b53561e",
            "campaignCode": "C_IWYS0HNV"
        }
    """

  val incentivePromotion =
    """
      {
            "codes": {
                "web": [
                    "EH2016"
                ]
            },
            "promotionType": {
                "redemptionInstructions": "We'll send you an email with instructions on redeeming your English Heritage offer within 35 days.",
                "name": "incentive"
            },
            "expires": "2016-03-31T23:00:00.000+00:00",
            "landingPage": {
                "productFamily": "membership",
                "roundelHtml": "<h1 class=\"roundel__title\">Free annual English Heritage membership</h1>\n<p class=\"roundel__description\">when you join as a Partner or Patron by 31 March</p>",
                "imageUrl": "https://media.guim.co.uk/838926f9c7f0d21eea4c6fb27fd3e5d627ab0596/0_0_5708_4416/5708.jpg"
            },
            "name": "Free English Heritage membership worth £88",
            "appliesTo": {
                "productRatePlanIds": [
                    "2c92a0fb4c5481dc014c69f95fce7240",
                    "2c92a0f94c54758b014c69f813bd39ec",
                    "2c92a0f94c547592014c69fb0c4274fc",
                    "2c92a0fb4c5481db014c69fb9118704b"
                ],
                "countries": [
                    "GB"
                ]
            },
            "description": "Free English Heritage membership worth £88 when you become a Partner or Patron Member",
            "starts": "2016-03-01T00:00:00.000+00:00",
            "uuid": "c3dedda2-ab31-4577-a873-a951f905bbd7",
            "campaignCode": "ENGLISH_HERITAGE_2016"
        }
    """

  val doubleWithIncentive =
    """
      {
            "codes": {
                "PRINT": [
                    "DAC21X"
                ],
                "TELEMARKETING INBOUND": [
                    "DAC11X"
                ],
                "RETAIL": [
                    "DAC71X"
                ],
                "ORGANIC SOCIAL": [
                    "DAC62X"
                ],
                "EDITORIAL": [
                    "DAC61X"
                ],
                "PAID SEARCH": [
                    "DAC41X"
                ],
                "INTERNAL COMMS": [
                    "DAC63X"
                ],
                "MERCHANDISING": [
                    "DAC51X"
                ],
                "EMAIL": [
                    "DAC31X"
                ],
                "OWNED DISPLAY": [
                    "DAC52X"
                ],
                "Default": [
                    "DAC99X"
                ],
                "Telemarketing Outbound": [
                    "DAC12X"
                ]
            },
            "promotionType": {
                "a": {
                    "redemptionInstructions": "Customers will be contacted by email a minimum of 35 days after their subscription start date with the redemption code to claim their incentive.",
                    "legalTerms": "**Entering the Promotion**\n \n1. The gift card promotion (the “Promotion”) is open to UK residents aged 18 and over (\"you\") subject to paragraph 2 below.\n2. Employees or agencies of Guardian News & Media Limited (\"GNM\", \"We\") and/or their group companies or their family members, or anyone else connected with the promotion may not enter the Promotion. \n3. By entering the promotion you are accepting these terms and conditions.\n4. To enter the promotion, you must: either (i) go to: gu.com/subscriptions/DAC99X or call 0330 333 6767 and quote DAC99X OR (ii) purchase a Digital Pack subscription and maintain that subscription for at least 35 days.\n5. Entry to this promotion is available only to new subscribers: this means that you must not already have a subscription to the Guardian and/or Observer to be eligible to participate in this Promotion.\n6. Please note that purchasing a subscription as referred to in paragraph 4 above will also be subject to the terms and conditions for Guardian and Observer Subscriptions available at: theguardian.com/digital-subscriptions-terms-conditions\n7. The opening date and time of the Promotion is 9am on 31 October 2016. The closing date and time of the promotion is 11.59pm on 22nd December. Purchases after that date and time will not be eligible for the promotion.\n8. If you opt to use the SMS response service to place your order you will be charged your standard network rate.\n9. Subject to successful payment processing of an eligible Guardian Digital Pack subscription, and maintenance of that subscription for at least 35 consecutive days, customers will be eligible to receive a £10 M&S e-gift card.\n10. You will be contacted by Guardian News & Media within 35 days of your eligible subscription commencing to be given details of how to select and claim your Free Gift. You will need to claim your Free Gift within 90 days of receiving your redemption information via email.\n11. Please note that any terms and conditions which apply to the Free Gift are separate to the contract you will enter into when you purchase a subscription as referred to in paragraphs 4 and 6 above.\n12. The Free Gift cannot be exchanged or transferred by you and cannot be redeemed by you for cash or any other free gift or prize. You must pay all other costs associated with the Free Gift and not specifically included in the Free Gift as specified in these terms and conditions.\n13. We retain the right to substitute the Free Gift with another free gift of similar value in the event that the Free Gift is not available for any reason.\n14. Only one entry to this Promotion per person. Entries on behalf of another person will not be accepted.\n15. We take no responsibility for entries that are lost, delayed, misdirected or incomplete or cannot be delivered or entered for any technical or other reason. Proof of delivery of the entry is not proof of receipt. \n16. The Promoter of the Promotion is Guardian News & Media Limited whose address is Kings Place, 90 York Way, London N1 9GU. Any complaints regarding the Promotion should be sent to this address.\n17. Nothing in these terms and conditions shall exclude the liability of GNM for death, personal injury, fraud or fraudulent misrepresentation as a result of its negligence.\n18. GNM accepts no responsibility for any damage, loss, liabilities, injury or disappointment incurred or suffered by you as a result of entering the Promotion or accepting the Free Gift or any substitute if applicable. GNM further disclaims liability for any injury or damage to you or any other person’s computer relating to or resulting from participation in the Promotion. \n19. GNM reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, this Promotion with or without prior notice due to reasons outside its control (including, without limitation, in the case of anticipated, suspected or actual fraud). The decision of 20. GNM in all matters under its control is final and binding.\nGNM shall not be liable for any failure to comply with its obligations where the failure is caused by something outside its reasonable control. Such circumstances shall include, but not be limited to, weather conditions, fire, flood, hurricane, strike, industrial dispute, war, hostilities, political unrest, riots, civil commotion, inevitable accidents, supervening legislation or any other circumstances amounting to force majeure.\n21. The Promotion will be governed by English law.",
                    "name": "incentive",
                    "termsAndConditions": "Offer open to UK mainland residents aged 18+. You must purchase a new Guardian Digital Pack subscription by 11.59pm on 22/12/2016 to be eligible for this offer and maintain the subscription for at least 35 days. Offer is a £10 M&S e-gift card for new Digital Pack subscribers. Please allow 35 days to receive details of how to claim your e-gift card. If you opt to use the SMS response service to place your order you will be charged your standard network rate. Offer subject to availability. In the event stock runs out you may be offered an alternative gift of a similar value or full refund. Customers will be contacted a minimum of 35 days after their subscription start date with the redemption code to claim their incentive offer. This offer ends 22/12/2016 and Guardian and Observer reserve the right to end this offer at any time."
                },
                "b": {
                    "amount": 50.07,
                    "durationMonths": 3,
                    "name": "percent_discount"
                },
                "name": "double"
            },
            "expires": "2016-12-22T23:59:59.000+00:00",
            "landingPage": {
                "roundelHtml": "### 50% off for 3 months",
                "description": "Enjoy the digital pack for half price.\n\nSubscribe before 22nd December 2016 and get the Digital Pack for just £5.99 for the first 3 months (standard price of £11.99 a month will apply after). \n\nNew UK digital pack subscribers also receive a £10 M&S e-gift card. Terms and conditions apply.",
                "title": "Get 50% off the Guardian Digital Pack for 3 months",
                "type": "digitalpack",
                "sectionColour": "grey"
            },
            "name": "Xmas 16 | UK | Trial + Discount  + Gift Card",
            "appliesTo": {
                "productRatePlanIds": [
                    "2c92a0fb4edd70c8014edeaa4eae220a",
                    "2c92a0fb4edd70c8014edeaa4e8521fe",
                    "2c92a0fb4edd70c8014edeaa4e972204"
                ],
                "countries": [
                    "GB"
                ]
            },
            "description": "Get 50% off the standard price for three months and receive a £10 M&S e-gift card.",
            "starts": "2016-10-19T00:00:00.000+01:00",
            "uuid": "2fcb22be-fae8-44c8-bd90-b93b4d6d3d9f",
            "campaignCode": "C_IUJPNBPQ"
        }
    """
}
