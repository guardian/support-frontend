package model

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers

class CurrencyTest extends AnyFlatSpec with Matchers {
  "exceedsMaxAmount" should "return true if the amount is greater than the allowed range" in {
    Currency.isAmountOutOfBounds(2100, Currency.GBP) mustBe true
  }

  it should "return false if the amount is below the allowed range" in {
    Currency.isAmountOutOfBounds(0.5, Currency.GBP) mustBe true
  }

  it should "return false if the amount is within the allowed range" in {
    Currency.isAmountOutOfBounds(100, Currency.GBP) mustBe false
  }

  it should "allow the max to be 4% larger than the value specified to allow for covering transaction cost" in {
    Currency.isAmountOutOfBounds(2080, Currency.GBP) mustBe false
  }
}
