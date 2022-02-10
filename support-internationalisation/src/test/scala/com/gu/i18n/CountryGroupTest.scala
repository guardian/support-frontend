package com.gu.i18n

import com.gu.i18n.Currency._
import org.scalatest.Inspectors
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class CountryGroupTest extends AsyncFlatSpec with Matchers with Inspectors {

  "A CountryGroup" should "be found by id" in {
    CountryGroup.byId("ie") shouldBe None
    CountryGroup.byId("eu") shouldBe Some(CountryGroup.Europe)
    CountryGroup.byId("int") shouldBe Some(CountryGroup.RestOfTheWorld)
  }

  it should "be found by its countries names and codes" in {
    CountryGroup.byCountryNameOrCode(Country.Australia.alpha2) shouldBe Some(CountryGroup.Australia)
    CountryGroup.byCountryNameOrCode(Country.Australia.name) shouldBe Some(CountryGroup.Australia)
    CountryGroup.byCountryNameOrCode(Country.US.alpha2) shouldBe Some(CountryGroup.US)
    CountryGroup.byCountryNameOrCode(Country.US.name) shouldBe Some(CountryGroup.US)
    CountryGroup.byCountryNameOrCode("Italy") shouldBe Some(CountryGroup.Europe)
    CountryGroup.byCountryNameOrCode("IT") shouldBe Some(CountryGroup.Europe)
    CountryGroup.byCountryNameOrCode("AF") shouldBe Some(CountryGroup.RestOfTheWorld)
    CountryGroup.byCountryNameOrCode("Afghanistan") shouldBe Some(CountryGroup.RestOfTheWorld)
    CountryGroup.byCountryNameOrCode("IE") shouldBe Some(CountryGroup.Europe)
  }

  it should "correctly identify its currencies" in {
    CountryGroup.availableCurrency(Set.empty)(Country.UK) shouldBe None
    CountryGroup.availableCurrency(Set(GBP, AUD))(Country.US) shouldBe None
    CountryGroup.availableCurrency(Set(GBP, AUD))(Country.UK) shouldBe Some(GBP)
    CountryGroup.availableCurrency(Set(GBP, AUD))(Country.Australia) shouldBe Some(AUD)
  }

  it should "identify countries correctly" in {
    forAll(CountryGroup.countries) { c =>
      CountryGroup.byOptimisticCountryNameOrCode(c.name) shouldBe Some(c)
      CountryGroup.byOptimisticCountryNameOrCode(c.alpha2) shouldBe Some(c)
    }
  }

  it should "handle null and return None" in {
    // noinspection ScalaStyle
    CountryGroup.byOptimisticCountryNameOrCode(null) shouldBe None
  }

  it should "identify countries from common alternatives" in {
    val tests = List(
      "FRANCE" -> CountryGroup.countryByCode("FR").get,
      "usa" -> Country.US,
      "republic of ireland" -> Country.Ireland,
      "rep. of ireland" -> Country.Ireland,
      "great britain" -> Country.UK,
      "the netherlands" -> CountryGroup.countryByCode("NL").get,
      "the czech republic" -> CountryGroup.countryByCode("CZ").get,
      "viet nam" -> CountryGroup.countryByCode("VN").get,
      "UK" -> Country.UK,
      "GB" -> Country.UK,
      "united states of america" -> Country.US,
      "trinidad and tobago" -> CountryGroup.countryByCode("TT").get,
    )
    forAll(tests) { case (name: String, country: Country) =>
      CountryGroup.byOptimisticCountryNameOrCode(name) shouldBe Some(country)
    }
  }

}
