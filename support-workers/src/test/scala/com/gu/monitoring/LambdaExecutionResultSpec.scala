package com.gu.monitoring

import java.util.UUID

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.support.workers.states.PaidProduct
import com.gu.support.workers.{Contribution, Monthly}
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class LambdaExecutionResultSpec extends AnyFlatSpec with Matchers {
  "LambdaExecutionResult" should "serialise correctly" in {
    val requestId = UUID.fromString("e18f6418-45f2-11e7-8bfa-8faac2182601")
    val success = LambdaExecutionResult(
      requestId, Success, isTestUser = false,
      Contribution(20, GBP, Monthly),
      PaidProduct(PayPal),
      None, isGift = false, None,
      Country.UK, None, None, None
    )

    success.asJson shouldBe parse(LambdaExecutionResultFixtures.successfulContribution).right.get
  }
}
