package com.gu.monitoring

import java.util.UUID

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.support.workers.{Contribution, Monthly, PayPalPaymentFields}
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class LambdaExecutionResultSpec extends AnyFlatSpec with Matchers{
  "LambdaExecutionResult" should "create a correct log message" in {
    val requestId = UUID.fromString("e18f6418-45f2-11e7-8bfa-8faac2182601")
    val success = LambdaExecutionResult(
      requestId, Success, false,
      Contribution(20, GBP, Monthly),
      Left(PayPalPaymentFields("1234")),
      None, false, None,
      Country.UK, None, None
    )

    success.asJson shouldBe parse(LambdaExecutionResultFixtures.successfulContribution).right.get
  }
}
