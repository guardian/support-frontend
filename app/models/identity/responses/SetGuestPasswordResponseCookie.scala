package models.identity.responses

import org.joda.time.{DateTime, Seconds}
import play.api.libs.json.{Json, Reads}
import play.api.mvc.{Cookie => PlayCookie}

import scala.concurrent.ExecutionContext

// Models a cookie from the cookies field of a successful response from the set guest password identity endpoint
case class SetGuestPasswordResponseCookie(key: String, value: String, sessionCookie: Option[Boolean] = None) {
  val isSessionCookie = sessionCookie.getOrElse(false)
}

// Models the cookies field of a successful response from the set guest password identity endpoint
case class SetGuestPasswordResponseCookies(expiresAt: DateTime, values: List[SetGuestPasswordResponseCookie])

object SetGuestPasswordResponseCookies {
  implicit val jodaDateReads = Reads[DateTime](js =>
    js.validate[String].map[DateTime](dtString =>
      DateTime.parse(dtString)))
  implicit val readsCookieResponse: Reads[SetGuestPasswordResponseCookie] = Json.reads[SetGuestPasswordResponseCookie]
  implicit val readsCookiesResponse: Reads[SetGuestPasswordResponseCookies] = Json.reads[SetGuestPasswordResponseCookies]

  def getCookies(setPasswordResponse: SetGuestPasswordResponseCookies, guardianDomain: String)
                (implicit executionContext: ExecutionContext): List[PlayCookie] = {
    setPasswordResponse.values.map { cookie =>
      val maxAge = Some(Seconds.secondsBetween(DateTime.now, setPasswordResponse.expiresAt).getSeconds)
      val secureHttpOnly = cookie.key.startsWith("SC_")
      val cookieMaxAgeOpt = maxAge.filterNot(_ => cookie.isSessionCookie)
      PlayCookie(cookie.key, cookie.value, cookieMaxAgeOpt, "/", Some(guardianDomain), secureHttpOnly, secureHttpOnly)
    }
  }
}
