package utils

import com.gu.i18n.CountryGroup
import play.api.mvc.Request

object RequestCountry {
  implicit class RequestWithFastlyCountry(r: Request[_]) {
    def fastlyCountry: Option[CountryGroup] = r.headers.get("X-GU-GeoIP-Country-Code").flatMap(CountryGroup.byFastlyCountryCode)
  }
  implicit class AuthenticatedRequestWithIdentity(r: /*Auth*/ Request[_])
}
