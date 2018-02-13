package com.gu.i18n


import Currency._
import org.scalatest.FlatSpec

class CountryGroupTest extends FlatSpec {


  "A CountryGroup" should "be found by id" in {
    assert(CountryGroup.byId("ie") === None)
    assert(CountryGroup.byId("eu") === Some(CountryGroup.Europe))
    assert(CountryGroup.byId("int") === Some(CountryGroup.RestOfTheWorld))
  }

  it should "be found by its countries names and codes" in {
    assert(CountryGroup.byCountryNameOrCode(Country.Australia.alpha2) === Some(CountryGroup.Australia))
    assert(CountryGroup.byCountryNameOrCode(Country.Australia.name) === Some(CountryGroup.Australia))
    assert(CountryGroup.byCountryNameOrCode(Country.US.alpha2) === Some(CountryGroup.US))
    assert(CountryGroup.byCountryNameOrCode(Country.US.name) === Some(CountryGroup.US))
    assert(CountryGroup.byCountryNameOrCode("Italy") === Some(CountryGroup.Europe))
    assert(CountryGroup.byCountryNameOrCode("IT") === Some(CountryGroup.Europe))
    assert(CountryGroup.byCountryNameOrCode("AF") === Some(CountryGroup.RestOfTheWorld))
    assert(CountryGroup.byCountryNameOrCode("Afghanistan") === Some(CountryGroup.RestOfTheWorld))
    assert(CountryGroup.byCountryNameOrCode("IE") === Some(CountryGroup.Europe))
  }

  it should "correctly identify its currencies" in {
    assert(CountryGroup.availableCurrency(Set.empty)(Country.UK) === None)
    assert(CountryGroup.availableCurrency(Set(GBP, AUD))(Country.US) === None)
    assert(CountryGroup.availableCurrency(Set(GBP, AUD))(Country.UK) === Some(GBP))
    assert(CountryGroup.availableCurrency(Set(GBP, AUD))(Country.Australia) === Some(AUD))
  }

  it should "identify countries correctly" in {
    CountryGroup.countries.map { c =>
      assert(
        CountryGroup.byOptimisticCountryNameOrCode(c.name) === Some(c)
      )
      assert(
        CountryGroup.byOptimisticCountryNameOrCode(c.alpha2) === Some(c)
      )
    }
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
      "GB" -> Country.UK
    )
    tests.map { case (name: String, country: Country) => assert(CountryGroup.byOptimisticCountryNameOrCode(name) === Some(country)) }
  }


}
