package com.gu.support.workers

import com.gu.support.workers.model.AccountAccessScope
import com.gu.support.workers.model.AccountAccessScope._
import org.scalatest.{FlatSpec, Matchers}

class AccountAccessScopeCodecTest extends FlatSpec with Matchers {

  it should "understand that no session id means the identity user is authenticated" in {
    val actual = AccountAccessScope.fromInput(None)
    actual should be(AuthenticatedAccess)
  }

  it should "where a session id is specified, allow access by that session id" in {
    val actual = AccountAccessScope.fromInput(Some("hello"))
    actual should be(SessionAccess(SessionId("hello")))
  }

}
