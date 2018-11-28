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
}
