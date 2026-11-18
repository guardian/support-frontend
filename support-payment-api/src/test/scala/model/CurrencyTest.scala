package model

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers

class CurrencyTest extends AnyFlatSpec with Matchers {
  "exceedsMaxAmount" should "return true if the amount is greater than the allowed range" in {
    Currency.isAmountOutOfBounds(20900, Currency.GBP) mustBe true
  }

  it should "return true if a USD amount is greater than the allowed range" in {
    Currency.isAmountOutOfBounds(20900, Currency.USD) mustBe true
  }

  it should "return false if a USD amount is within the allowed range" in {
    Currency.isAmountOutOfBounds(20000, Currency.USD) mustBe false
  }

  it should "return false if an AUD amount is above the default max but within the AUD range" in {
    Currency.isAmountOutOfBounds(25000, Currency.AUD) mustBe false
  }

  it should "return true if the amount is below the allowed range" in {
    Currency.isAmountOutOfBounds(0.5, Currency.GBP) mustBe true
  }

  it should "return false if the amount is within the allowed range" in {
    Currency.isAmountOutOfBounds(100, Currency.GBP) mustBe false
  }

  it should "allow the amount to be 4% larger than the nominal max to allow for covering transaction cost" in {
    Currency.isAmountOutOfBounds(20800, Currency.GBP) mustBe false
  }
}
