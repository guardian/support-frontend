package models.identity

import com.gu.identity.model.LiftJsonConfig
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import play.api.libs.json.{Json, Reads}

case class CookieResponse(key: String, value: String, sessionCookie: Option[Boolean] = None)

case class CookiesResponse(expiresAt: DateTime, values: List[CookieResponse])

object CookiesResponse {
  implicit val jodaDateReads = Reads[DateTime](js =>
    js.validate[String].map[DateTime](dtString =>
      DateTime.parse(dtString)))
  implicit val readsCookieResponse: Reads[CookieResponse] = Json.reads[CookieResponse]
  implicit val readsCookiesResponse: Reads[CookiesResponse] = Json.reads[CookiesResponse]
}
