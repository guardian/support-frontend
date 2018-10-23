package com.gu.support.workers

import com.gu.support.workers.model.AccessScope.{AccessScopeBySessionId, AccessScopeNoRestriction, SessionId}
import com.gu.zuora.GetAccountForIdentity.{CreatedInSession, NotCreatedInSession}
import org.scalatest.{FlatSpec, Matchers}

class GetRecurringSubscriptionIsInAccessScopeSpec extends FlatSpec with Matchers {

  it should "allow access to unlabelled accounts where there is no restriction" in {
    IsSubscriptionAccessAllowed(AccessScopeNoRestriction, NotCreatedInSession) should be(true)
  }

  it should "allow access to labelled accounts where there is no restriction" in {
    IsSubscriptionAccessAllowed(AccessScopeNoRestriction, CreatedInSession(SessionId("existing"))) should be(true)
  }

  it should "allow access to labelled accounts where there is a restriction to that label" in {
    IsSubscriptionAccessAllowed(AccessScopeBySessionId(SessionId("existing")), CreatedInSession(SessionId("existing"))) should be(true)
  }

  it should "NOT allow access to unlabelled accounts where there is a restriction" in {
    IsSubscriptionAccessAllowed(AccessScopeBySessionId(SessionId("restricted")), NotCreatedInSession) should be(false)
  }

  it should "NOT allow access to labelled accounts where there is a conflicting restriction" in {
    IsSubscriptionAccessAllowed(AccessScopeBySessionId(SessionId("restricted")), CreatedInSession(SessionId("existing"))) should be(false)
  }

}
