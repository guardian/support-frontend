package com.gu.support.promotions

object DefaultPromotions {

  object DigitalSubscription {
    object Monthly {
      val fiftyPercentOff3Months: String = "DK0NT24WG"
      def all: List[String] = List(fiftyPercentOff3Months)
    }

    object Annual {
      def all: List[String] = List(
        "ANNUAL-INTRO-GLOBAL",
      )
    }
    def all: List[PromoCode] = Monthly.all ++ Annual.all
  }

  object GuardianWeekly {
    object Gift {
      val twentyPercentOff: String = "GW20GIFT1Y"
      def all: List[String] = List(twentyPercentOff)
    }
    object NonGift {
      val sixForSix: String = "6FOR6"
    }
  }

}
