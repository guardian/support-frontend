package models.identity

import com.gu.identity.model.LiftJsonConfig
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import play.api.libs.json.{Json, Reads}

case class CookieResponse(key: String, value: String, sessionCookie: Option[Boolean] = None)

case class CookiesResponse(expiresAt: DateTime, values: List[CookieResponse])

object CookiesResponse {
  val dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
  implicit val jodaDateReads = Reads[DateTime](js =>
    js.validate[String].map[DateTime](dtString =>
      DateTime.parse(dtString, DateTimeFormat.forPattern(dateFormat))))
  implicit val readsCookieResponse: Reads[CookieResponse] = Json.reads[CookieResponse]
  implicit val readsCookiesResponse: Reads[CookiesResponse] = Json.reads[CookiesResponse]
}
