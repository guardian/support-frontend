package models.identity

import models.GeoData
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class RegistrationLocationTest extends AnyFlatSpec with Matchers {
  "registrationLocationFromGeoData" should "return United Kingdom when the country is GB" in {
    val geoData = GeoData(Some("GB"), Some("ISL"))

    val result = RegistrationLocation.registrationLocationFromGeoData(geoData)

    result shouldBe Some("United Kingdom")
  }

  it should "return United States when the country is US" in {
    val geoData = GeoData(Some("US"), Some("AZ"))

    val result = RegistrationLocation.registrationLocationFromGeoData(geoData)

    result shouldBe Some("United States")
  }

  it should "return Other for a country in the international group" in {
    val geoData = GeoData(Some("JP"), None)

    val result = RegistrationLocation.registrationLocationFromGeoData(geoData)

    result shouldBe Some("Other")
  }

  "registrationLocationStateFromGeoData" should "return the validated state name if country is US" in {
    val geoData = GeoData(Some("US"), Some("AK"))

    val result = RegistrationLocation.registrationLocationStateFromGeoData(geoData)

    result shouldBe Some("Alaska")
  }

  it should "return the validated state name if the country is AU" in {
    val geoData = GeoData(Some("AU"), Some("NSW"))

    val result = RegistrationLocation.registrationLocationStateFromGeoData(geoData)

    result shouldBe Some("New South Wales")
  }

  it should "return None if the state code doesn't exist for the country" in {
    val geoData = GeoData(Some("US"), Some("BB"))

    val result = RegistrationLocation.registrationLocationStateFromGeoData(geoData)

    result shouldBe None
  }

  it should "return None if the country is neither AU or US" in {
    val geoData = GeoData(Some("CA"), Some("AB"))

    val result = RegistrationLocation.registrationLocationStateFromGeoData(geoData)

    result shouldBe None
  }
}
