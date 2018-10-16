package com.gu.support.workers.model

import com.gu.support.workers.model.AccessScope.{AccessScopeByToken, AccessScopeNoRestriction, ScopeToken}

sealed trait AccessScope {
  def toOption: Option[String] = this match {
    case AccessScopeByToken(ScopeToken(value)) => Some(value)
    case AccessScopeNoRestriction => None
  }
}

object AccessScope {

  def fromRaw(maybeAccessScope: Option[String]): AccessScope =
    maybeAccessScope match {
      case Some(value) => AccessScopeByToken(ScopeToken(value))
      case None => AccessScopeNoRestriction
    }

  case class ScopeToken(value: String) extends AnyVal

  case class AccessScopeByToken(scopeToken: ScopeToken) extends AccessScope
  case object AccessScopeNoRestriction extends AccessScope

}
