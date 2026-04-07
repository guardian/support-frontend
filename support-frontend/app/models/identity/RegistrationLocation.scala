package models.identity

import models.GeoData

case object RegistrationLocation {
  def registrationLocationFromGeoData(geoData: GeoData): Option[String] = {
    geoData.countryGroup.map(_.name) match {
      case Some("International") => Some("Other")
      case countryGroup => countryGroup
    }
  }

  def registrationLocationStateFromGeoData(geoData: GeoData): Option[String] = {
    geoData.countryCode match {
      case Some("US") | Some("AU") => geoData.validatedStateNameForCountry
      case _ => None
    }
  }
}
