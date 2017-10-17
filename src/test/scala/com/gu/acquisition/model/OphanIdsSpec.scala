package com.gu.acquisition.model

import org.scalatest.{Matchers, WordSpecLike}

class OphanIdsSpec extends WordSpecLike with Matchers {
  "OphanIds" should {
    "synthesise correct pageview IDs" in {
      val desiredLength = 20
      val suffix = "AEP"

      (1 to 100).foreach { _ =>
        val id = OphanIds.syntheticPageviewId
        id.length.shouldBe(desiredLength)
        id.takeRight(3).shouldBe(suffix)
      }
    }
  }
}