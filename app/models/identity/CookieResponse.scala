package models.identity

import org.joda.time.DateTime

case class CookieResponse(key: String, value: String, sessionCookie: Option[Boolean] = None)

case class CookiesResponse(expiresAt: DateTime, values: List[CookieResponse])