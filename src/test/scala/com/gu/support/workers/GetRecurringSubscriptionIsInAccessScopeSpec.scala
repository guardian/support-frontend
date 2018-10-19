package com.gu.support.workers

import com.gu.support.workers.model.AccessScope.{AccessScopeBySessionId, AccessScopeNoRestriction, SessionId}
import org.scalatest.{FlatSpec, Matchers}

class GetRecurringSubscriptionIsInAccessScopeSpec extends FlatSpec with Matchers {

  it should "allow access to unlabelled accounts where there is no restriction" in {
    GetRecurringSubscription.isInAccessScope(AccessScopeNoRestriction, None) should be(true)
  }

  it should "allow access to labelled accounts where there is no restriction" in {
    GetRecurringSubscription.isInAccessScope(AccessScopeNoRestriction, Some(SessionId("existing"))) should be(true)
  }

  it should "allow access to labelled accounts where there is a restriction to that label" in {
    GetRecurringSubscription.isInAccessScope(AccessScopeBySessionId(SessionId("existing")), Some(SessionId("existing"))) should be(true)
  }

  it should "NOT allow access to unlabelled accounts where there is a restriction" in {
    GetRecurringSubscription.isInAccessScope(AccessScopeBySessionId(SessionId("restricted")), None) should be(false)
  }

  it should "NOT allow access to labelled accounts where there is a conflicting restriction" in {
    GetRecurringSubscription.isInAccessScope(AccessScopeBySessionId(SessionId("restricted")), Some(SessionId("existing"))) should be(false)
  }

}
