package model

import com.gu.support.acquisitions.ga.models.GAData

import java.util.UUID
import play.api.mvc.Request

case class ClientBrowserInfo(
    hostname: String,
    gaClientId: String,
    userAgent: Option[String],
    ipAddress: Option[String],
    countrySubdivisionCode: Option[String],
)

object ClientBrowserInfo {
  def fromRequest(request: Request[_], gaClientId: Option[String]): ClientBrowserInfo = {
    ClientBrowserInfo(
      hostname = request.headers.get("origin").map(_.stripPrefix("https://")).getOrElse("support.theguardian.com"),
      gaClientId = gaClientId.getOrElse(UUID.randomUUID().toString),
      userAgent = request.headers.get("user-agent"),
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#Syntax
      ipAddress = request.headers.get("X-Forwarded-For").flatMap(_.split(',').headOption),
      countrySubdivisionCode = request.headers.get("GU-ISO-3166-2"),
    )
  }

  def toGAData(clientBrowserInfo: ClientBrowserInfo) = GAData(
    hostname = clientBrowserInfo.hostname,
    clientId = clientBrowserInfo.gaClientId,
    clientIpAddress = clientBrowserInfo.ipAddress,
    clientUserAgent = clientBrowserInfo.userAgent,
  )
}
