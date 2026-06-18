package com.gu.support.promotions

object Fixtures {
  val startDate = "2018-10-03T00:00:00.000Z"

  val discountPromotion =
    s"""
    {
      "promoCode":  "WAN82G",
      "discount": {
          "amount": 30,
          "durationMonths": 12
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
      "startTimestamp": "$startDate",
      "campaignCode": "C_IZY6K6ZY",
      "landingPage": {
        "title": "Get 50% off the Guardian Digital Pack for 3 months",
        "description": "Enjoy the digital pack for half price.\\n\\nSubscribe before 22nd December 2016 and get the Digital Pack for just £5.99 for the first 3 months (standard price of £11.99 a month will apply after). \\n\\nNew UK digital pack subscribers also receive a £10 M&S e-gift card. Terms and conditions apply.",
        "roundel": "### 50% off for 3 months"
      }
    }
  """
}
