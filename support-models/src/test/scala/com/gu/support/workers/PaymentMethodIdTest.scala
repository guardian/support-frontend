package com.gu.support.workers
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class PaymentMethodIdTest extends AsyncFlatSpec with Matchers {

  it should "accept a valid id" in {
    val data = "pm_09AZaz"
    val result = PaymentMethodId(data)
    result.map(_.value) shouldBe Some(data)
  }

  it should "NOT accept a dangerous id" in {
    val data = "pm_/09AZaz"
    val result = PaymentMethodId(data)
    result shouldBe None
  }

}
