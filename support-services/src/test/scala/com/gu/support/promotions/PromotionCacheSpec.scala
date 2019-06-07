package com.gu.support.promotions

import org.joda.time.DateTime
import org.scalatest.{FlatSpec, Matchers}

class PromotionCacheSpec extends FlatSpec with Matchers {

  "PromotionCache" should "return cached promotions when they are fresh" in {
    PromotionCache.set(Nil)
    PromotionCache.get shouldBe Some(Nil)
  }

  it should "return None if they are stale" in {
    PromotionCache.set(Nil, DateTime.now().minusSeconds(61))
    PromotionCache.get shouldBe None
  }
}
