package com.gu.support.promotions

object DefaultPromotions {

  object DigitalSubscription {
    object Monthly {
      val fiftyPercentOff3Months = "DK0NT24WG"
      def all = List(fiftyPercentOff3Months)
    }

    object Annual {
      def all = List(
        "ANNUAL-INTRO-EU",
        "ANNUAL-INTRO-UK",
        "ANNUAL-INTRO-US",
        "ANNUAL-INTRO-NZ",
        "ANNUAL-INTRO-CA",
        "ANNUAL-INTRO-AU",
      )
    }
    def all: List[PromoCode] = Monthly.all ++ Annual.all
  }

  object Paper {
    val june21Promotion = "JUNE21SALE"
  }

  object GuardianWeekly {
    object Gift {
      val twentyPercentOff = "GW20GIFT1Y"
      def all = List(twentyPercentOff)
    }
    object NonGift {
      val sixForSix = "6FOR6"
      val tenAnnual = "10ANNUAL"
      val ausAnnual = "GW25OZ"
      val jan21Promotion = "GWJAN22SALE"
      def all(countryCode: String): List[String] = List(
        sixForSix,
        if (countryCode.toLowerCase == "au") ausAnnual else tenAnnual,
        jan21Promotion
      )
    }
  }

}
