package com.gu.support.promotions

object DefaultPromotions {

  object GuardianWeekly {
    object Gift {
      val twentyPercentOff = "GW20GIFT1Y"
      def all = List(twentyPercentOff)
    }
    object NonGift {
      val sixForSix = "6FOR6"
    }
  }

}
