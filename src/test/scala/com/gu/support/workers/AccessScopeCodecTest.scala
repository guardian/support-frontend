package com.gu.support.workers

import com.gu.support.workers.model.AccountAccessScope
import com.gu.support.workers.model.AccountAccessScope._
import org.scalatest.{FlatSpec, Matchers}

class AccountAccessScopeCodecTest extends FlatSpec with Matchers {

  it should "for backwards compatibility, deserialise when it's not specified to no restriction" in {
    val actual = AccountAccessScope.fromInput(None)
    actual should be(AuthenticatedAccess)
  }

  it should "deserialise when it's got a value to token scope" in {
    val actual = AccountAccessScope.fromInput(Some("hello"))
    actual should be(SessionAccess(SessionId("hello")))
  }

}
