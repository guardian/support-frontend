package com.gu.support.idealpostcodes

import com.gu.i18n.Country
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.IdealPostcodesConfig
import com.gu.support.encoding.StringExtensions.ExtendedString
import com.gu.support.getaddressio.{FindAddressAPIResult, FindAddressResultError}
import com.gu.support.workers.Address

import scala.concurrent.{ExecutionContext, Future}
case class IdealPostcodesAddress(
    line_1: String,
    line_2: String,
    line_3: String,
    post_town: String,
    county: String,
    postcode: String,
)
case class IdealPostcodesAddressResponse(
    result: List[IdealPostcodesAddress],
)

object IdealPostcodesAddress {
  import com.gu.support.encoding.Codec
  import com.gu.support.encoding.Codec._
  implicit val codec: Codec[IdealPostcodesAddress] = deriveCodec
}

object IdealPostcodesAddressResponse {
  import com.gu.support.encoding.Codec
  import com.gu.support.encoding.Codec._
  implicit val codec: Codec[IdealPostcodesAddressResponse] = deriveCodec
}

class IdealPostcodesService(config: IdealPostcodesConfig, client: FutureHttpClient)(implicit
    executionContext: ExecutionContext,
) extends WebServiceHelper[FindAddressResultError] {

  override val wsUrl: String = "https://api.ideal-postcodes.co.uk/v1/postcodes/"
  override val httpClient: FutureHttpClient = client

  def find(postalCode: String): Future[List[Address]] =
    get[IdealPostcodesAddressResponse](postalCode, Map("Authorization" -> s"api_key=\"${config.apiKey}\""))
      .map(_.result.map(result => addressFromIdealPostcodeAddress(result)))

  private def addressFromIdealPostcodeAddress(address: IdealPostcodesAddress): Address = {
    Address(
      Some(address.line_1),
      Some(address.line_2),
      Some(address.post_town),
      Some(address.county),
      Some(address.postcode),
      Country.UK,
    )
  }
}
