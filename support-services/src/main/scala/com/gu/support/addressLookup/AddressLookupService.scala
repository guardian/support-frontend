package com.gu.support.addressLookup
import com.gu.i18n.Country
import com.gu.i18n.CountryGroup.countryByCode
import com.gu.support.encoding.StringExtensions.ExtendedString
import com.gu.support.workers.Address
import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
import software.amazon.awssdk.services.geoplaces.GeoPlacesClient
import software.amazon.awssdk.services.geoplaces.model.{
  AutocompleteAdditionalFeature,
  AutocompleteIntendedUse,
  AutocompleteRequest,
}

import scala.jdk.CollectionConverters.ListHasAsScala

case class AddressLookupResult(title: String, address: Address)
object AddressLookupResult {
  implicit val codec: Codec[AddressLookupResult] = deriveCodec
}
class AddressLookupService {
  def lookupAddress(searchTerm: String): List[AddressLookupResult] = {
    val client = GeoPlacesClient.builder().build()
    val request = AutocompleteRequest
      .builder()
      .queryText(searchTerm)
      .maxResults(10)
      .additionalFeatures(AutocompleteAdditionalFeature.CORE)
      .intendedUse(AutocompleteIntendedUse.SINGLE_USE)
      .build()
    val results = client.autocomplete(request)
    results
      .resultItems()
      .asScala
      .toList
      .map(result =>
        AddressLookupResult(
          result.title(),
          Address(
            checkForNull(result.address().addressNumber()),
            checkForNull(result.address().street()),
            checkForNull(result.address().locality()),
            checkForNull(result.address().district()),
            checkForNull(result.address().postalCode()),
            countryByCode(result.address().country().code2()).getOrElse(Country.UK),
          ),
        ),
      )
  }
  def checkForNull(value: String): Option[String] = {
    if (value == null || value.isEmpty) None else Some(value)
  }
}
