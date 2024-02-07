package com.gu.support.promotions

import org.joda.time.DateTime
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class PromotionCacheSpec extends AsyncFlatSpec with Matchers {

  "PromotionCache" should "return cached promotions when they are fresh" in {
    val cache = new PromotionCache
    cache.set(Nil)
    cache.get shouldBe Some(Nil)
  }

  it should "return None if they are stale" in {
    val cache = new PromotionCache
    cache.set(Nil, DateTime.now().minusSeconds(61))
    cache.get shouldBe None
  }
}
