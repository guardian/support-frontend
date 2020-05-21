package com.gu.acquisition.model

import org.scalatest.{Matchers, WordSpecLike}

class SyntheticPageviewIdSpec extends WordSpecLike with Matchers {
  "OphanIds" should {
    "synthesise correct pageview IDs" in {
      (1 to 100).foreach { _ =>
        val id = SyntheticPageviewId.generate
        id.length.shouldBe(SyntheticPageviewId.defaultLength)
        id.takeRight(3).shouldBe(SyntheticPageviewId.defaultSuffix)
      }
    }
  }
}