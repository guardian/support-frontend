package com.gu.support.workers

import java.util.UUID

import com.gu.support.zuora.domain.CreatedRequestId
import org.scalatest.{FlatSpec, Matchers}

class IsSameRequestSpec extends FlatSpec with Matchers {

  it should "not allow access to unlabelled accounts" in {
    val uuid1 = UUID.randomUUID()
    IsSameRequest(uuid1, None) should be(false)
  }

  it should "allow access to labelled accounts when we have the same request id" in {
    val uuid1 = UUID.randomUUID()
    IsSameRequest(uuid1, Some(CreatedRequestId(uuid1.toString))) should be(true)
  }

  it should "not allow access to labelled accounts where the label is different" in {
    val uuid1 = UUID.randomUUID()
    val uuid2 = UUID.randomUUID()
    IsSameRequest(uuid1, Some(CreatedRequestId(uuid2.toString))) should be(false)
  }

}
