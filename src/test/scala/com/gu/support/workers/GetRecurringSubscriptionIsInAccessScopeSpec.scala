package com.gu.support.workers

import com.gu.support.workers.model.AccountAccessScope.{SessionAccess, AuthenticatedAccess, SessionId}
import com.gu.zuora.GetAccountForIdentity.{CreatedInSession, NotCreatedInSession}
import org.scalatest.{FlatSpec, Matchers}

class GetRecurringSubscriptionIsInAccountAccessScopeSpec extends FlatSpec with Matchers {

  it should "allow access to unlabelled accounts where there is no restriction" in {
    IsAccountAccessAllowed(AuthenticatedAccess, NotCreatedInSession) should be(true)
  }

  it should "allow access to labelled accounts where there is no restriction" in {
    IsAccountAccessAllowed(AuthenticatedAccess, CreatedInSession(SessionId("existing"))) should be(true)
  }

  it should "allow access to labelled accounts where there is a restriction to that label" in {
    IsAccountAccessAllowed(SessionAccess(SessionId("existing")), CreatedInSession(SessionId("existing"))) should be(true)
  }

  it should "NOT allow access to unlabelled accounts where there is a restriction" in {
    IsAccountAccessAllowed(SessionAccess(SessionId("restricted")), NotCreatedInSession) should be(false)
  }

  it should "NOT allow access to labelled accounts where there is a conflicting restriction" in {
    IsAccountAccessAllowed(SessionAccess(SessionId("restricted")), CreatedInSession(SessionId("existing"))) should be(false)
  }

}
