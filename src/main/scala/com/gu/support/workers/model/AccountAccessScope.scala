package com.gu.support.workers.model

// Care control is needed when someone adds a new recurring contribution to an existing identity account.
// If they are not logged in we can only reveal "in scope" information from the existing identity account when processing
// the new contribution.  This includes side channels such as whether we take payment or even timing attacks.
sealed trait AccountAccessScope

object AccountAccessScope {

  def fromInput(maybeSessionId: Option[String]): AccountAccessScope =
    maybeSessionId match {
      case Some(value) => SessionAccess(SessionId(value))
      case None => AuthenticatedAccess
    }

  case class SessionId(value: String) extends AnyVal

  // this means we can only reveal information from the same session (as they are not logged in)
  case class SessionAccess(scopeToken: SessionId) extends AccountAccessScope
  // this means we can reveal any information from the identity id (as they own the email address)
  case object AuthenticatedAccess extends AccountAccessScope

}
