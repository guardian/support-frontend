package com.gu.support.workers.model

import com.gu.support.workers.model.AccountAccessScope.{SessionAccess, AuthenticatedAccess, SessionId}

sealed trait AccountAccessScope {
  def toWire: Option[String] = this match {
    case SessionAccess(SessionId(value)) => Some(value)
    case AuthenticatedAccess => None
  }
}

object AccountAccessScope {

  def fromWire(maybeAccessScope: Option[String]): AccountAccessScope =
    maybeAccessScope match {
      case Some(value) => SessionAccess(SessionId(value))
      case None => AuthenticatedAccess
    }

  case class SessionId(value: String) extends AnyVal

  case class SessionAccess(scopeToken: SessionId) extends AccountAccessScope
  case object AuthenticatedAccess extends AccountAccessScope

}
