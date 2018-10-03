package models.identity

import org.joda.time.{DateTime, Seconds}
import play.api.libs.json.{Json, Reads}
import play.api.mvc.Cookie

import scala.concurrent.ExecutionContext

case class CookieResponse(key: String, value: String, sessionCookie: Option[Boolean] = None) {
  val isSessionCookie = sessionCookie.getOrElse(false)
}

case class CookiesResponse(expiresAt: DateTime, values: List[CookieResponse])

object CookiesResponse {
  implicit val jodaDateReads = Reads[DateTime](js =>
    js.validate[String].map[DateTime](dtString =>
      DateTime.parse(dtString)))
  implicit val readsCookieResponse: Reads[CookieResponse] = Json.reads[CookieResponse]
  implicit val readsCookiesResponse: Reads[CookiesResponse] = Json.reads[CookiesResponse]

  def getCookies(cookiesResponse: CookiesResponse, guardianDomain: String)(implicit executionContext: ExecutionContext): List[Cookie] = {
    cookiesResponse.values.map { cookie =>
      val maxAge = Some(Seconds.secondsBetween(DateTime.now, cookiesResponse.expiresAt).getSeconds)
      val secureHttpOnly = cookie.key.startsWith("SC_")
      val cookieMaxAgeOpt = maxAge.filterNot(_ => cookie.isSessionCookie)
      Cookie(cookie.key, cookie.value, cookieMaxAgeOpt, "/", Some(guardianDomain), secureHttpOnly, secureHttpOnly)
    }
  }
}
