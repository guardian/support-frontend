package com.gu.support.workers

import com.gu.support.workers.model.AccessScope
import com.gu.support.workers.model.AccessScope._
import org.scalatest.{FlatSpec, Matchers}

class AccessScopeCodecTest extends FlatSpec with Matchers {

  it should "for backwards compatibility, deserialise when it's not specified to no restriction" in {
    val actual = AccessScope.fromRaw(None)
    actual should be(AccessScopeNoRestriction)
  }

  it should "deserialise when it's got a value to token scope" in {
    val actual = AccessScope.fromRaw(Some("hello"))
    actual should be(AccessScopeBySessionId(SessionId("hello")))
  }

}
