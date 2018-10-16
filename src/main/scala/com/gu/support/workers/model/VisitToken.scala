package com.gu.support.workers.model

sealed trait AccessScopeWithinIdentityId
case class AccessScopeByToken(scopeToken: ScopeToken) extends AccessScopeWithinIdentityId
case object AccessScopeNoRestriction extends AccessScopeWithinIdentityId

case class ScopeToken(value: String) extends AnyVal
