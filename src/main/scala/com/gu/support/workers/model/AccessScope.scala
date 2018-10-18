package com.gu.support.workers.model

import com.gu.support.workers.model.AccessScope.{AccessScopeBySessionId, AccessScopeNoRestriction, SessionId}

sealed trait AccessScope {
  def toOption: Option[String] = this match {
    case AccessScopeBySessionId(SessionId(value)) => Some(value)
    case AccessScopeNoRestriction => None
  }
}

object AccessScope {

  def fromRaw(maybeAccessScope: Option[String]): AccessScope =
    maybeAccessScope match {
      case Some(value) => AccessScopeBySessionId(SessionId(value))
      case None => AccessScopeNoRestriction
    }

  case class SessionId(value: String) extends AnyVal

  case class AccessScopeBySessionId(scopeToken: SessionId) extends AccessScope
  case object AccessScopeNoRestriction extends AccessScope

}
