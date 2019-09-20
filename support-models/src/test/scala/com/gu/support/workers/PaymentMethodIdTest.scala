package com.gu.support.workers

import org.scalatest.{FlatSpec, Matchers}

class PaymentMethodIdTest extends FlatSpec with Matchers {

  it should "accept a valid id" in {
    val data = "pm_09AZaz"
    val result = PaymentMethodId(data)
    result.map(_.value) should be(Some(data))
  }

  it should "NOT accept a dangerous id" in {
    val data = "pm_/09AZaz"
    val result = PaymentMethodId(data)
    result should be(None)
  }

}
