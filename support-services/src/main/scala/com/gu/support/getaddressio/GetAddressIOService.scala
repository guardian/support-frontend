package com.gu.support.getaddressio

import com.gu.i18n.{Country, PostalCode}
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.GetAddressIOConfig
import com.typesafe.scalalogging.LazyLogging
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.workers.Address
import okhttp3.{Request, Response}
import com.gu.support.encoding.StringExtensions._

import scala.concurrent.{ExecutionContext, Future}

case class FindAddressAPIResult(Latitude: Float, Longitude: Float, Addresses: List[String])

object FindAddressAPIResult {
  implicit val codec: Codec[FindAddressAPIResult] = deriveCodec
}

case class FindAddressResultError(Message: String) extends Throwable(s"$Message")

object FindAddressResultError {
  implicit val codec: Codec[FindAddressResultError] = deriveCodec
}

class GetAddressIOService(config: GetAddressIOConfig, client: FutureHttpClient)(implicit
    executionContext: ExecutionContext,
) extends WebServiceHelper[FindAddressResultError]
    with LazyLogging {

  override val wsUrl: String = config.apiUrl
  override val httpClient: FutureHttpClient = client

  def find(postalCode: String): Future[List[Address]] =
    get[FindAddressAPIResult](postalCode, Map("api-key" -> config.apiKey))
      .map(_.Addresses.map(s => addressFromString(postalCode, s)))

  def addressFromString(postalCode: String, addressString: String): Address = {
    val splitAddress = addressString.split(",").map(_.trim)
    Address(
      splitAddress(0).toOption,
      splitAddress(1).toOption,
      splitAddress(5).toOption,
      splitAddress(6).toOption,
      Some(postalCode),
      Country.UK,
    )
  }
}
