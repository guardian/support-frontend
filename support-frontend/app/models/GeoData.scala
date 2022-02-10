package models

import com.gu.i18n.{Country, CountryGroup}

case class GeoData(countryCode: Option[String], stateCode: Option[String]) {
  def countryGroup: Option[CountryGroup] = countryCode.flatMap(CountryGroup.byFastlyCountryCode)
  def country: Option[Country] = countryCode.flatMap(CountryGroup.countryByCode)
  def validatedStateCodeForCountry: Option[String] = for {
    c <- country
    r <- stateCode
    stateName <- c.statesByCode.keySet.find(_ == r)
  } yield stateName
}
