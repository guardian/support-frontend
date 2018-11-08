package model

import java.util.UUID

import com.gu.acquisition.model.GAData
import play.api.mvc.Request

case class ClientBrowserInfo(
  hostname: String,
  gaClientId: String,
  userAgent: Option[String],
  ipAddress: String,
  countrySubdivisionCode: Option[String]
)

object ClientBrowserInfo {
  def fromRequest(request: Request[_], gaClientId: Option[String]): ClientBrowserInfo = {
    ClientBrowserInfo(
      hostname = request.host,
      gaClientId = gaClientId.getOrElse(UUID.randomUUID().toString),
      userAgent = request.headers.get("user-agent"),
      ipAddress = request.remoteAddress,
      countrySubdivisionCode = request.headers.get("GU-ISO-3166-2")
    )
  }

  def toGAData(clientBrowserInfo: ClientBrowserInfo) = GAData(
    hostname = clientBrowserInfo.hostname,
    clientId = clientBrowserInfo.gaClientId,
    clientIpAddress = Some(clientBrowserInfo.ipAddress),
    clientUserAgent = clientBrowserInfo.userAgent
  )
}
