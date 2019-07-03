package utils

import com.gu.i18n.CountryGroup
import play.api.mvc.Request

object FastlyGEOIP {

  val fastlyCountryHeader = "X-GU-GeoIP-Country-Code"
  val fastlyRegionHeader = "X-GU-GeoIP-Region"

  implicit class RequestWithFastlyGEOIP(r: Request[_]) {
    def fastlyCountry: Option[CountryGroup] =
      r.headers.get(fastlyCountryHeader).flatMap(CountryGroup.byFastlyCountryCode)
    def fastlyRegion: Option[String] = r.headers.get(fastlyRegionHeader)
  }
}
