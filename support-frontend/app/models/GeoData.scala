package models

import com.gu.i18n.{Country, CountryGroup}

case class GeoData(countryCode: Option[String], stateCode: Option[String]) {
  def countryGroup: Option[CountryGroup] = countryCode.flatMap(CountryGroup.byFastlyCountryCode)
  def country: Option[Country] = countryCode.flatMap(CountryGroup.countryByCode)
  def validatedStateNameForCountry: Option[String] = for {
    c <- country
    r <- stateCode
    stateName <- c.statesByCode.get(r) orElse c.statesByCode.values.find(_ == r)
  } yield stateName
  def validatedStateCodeForCountry: Option[String] = for {
    c <- country
    r <- stateCode
    stateName <- c.statesByCode.keySet.find(_ == r) orElse c.statesByCode.map(_.swap).get(r)
  } yield stateName
}

