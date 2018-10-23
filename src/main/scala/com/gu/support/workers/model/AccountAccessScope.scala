package com.gu.support.workers.model

sealed trait AccountAccessScope

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
