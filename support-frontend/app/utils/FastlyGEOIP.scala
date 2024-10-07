package utils

import models.GeoData
import play.api.mvc.Request

object FastlyGEOIP {

  val fastlyCountryHeader: String = "X-GU-GeoIP-Country-Code"
  val fastlyRegionHeader: String = "X-GU-GeoIP-Region"

  implicit class RequestWithFastlyGEOIP(r: Request[_]) {
    def fastlyCountry: Option[String] = r.headers.get(fastlyCountryHeader)
    def fastlyRegion: Option[String] = r.headers.get(fastlyRegionHeader)
    def geoData: GeoData = GeoData(fastlyCountry, fastlyRegion)
  }
}
