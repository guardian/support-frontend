package utils

import com.gu.i18n.CountryGroup
import play.api.mvc.Request

object RequestCountry {

  val fastlyCountryHeader = "X-GU-GeoIP-Country-Code"

  implicit class RequestWithFastlyCountry(r: Request[_]) {
    def fastlyCountry: Option[CountryGroup] =
      r.headers.get(fastlyCountryHeader).flatMap(CountryGroup.byFastlyCountryCode)
  }
}
