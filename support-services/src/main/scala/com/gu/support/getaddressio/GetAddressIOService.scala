package com.gu.support.getaddressio

import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.config.GetAddressIOConfig
import com.typesafe.scalalogging.LazyLogging
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import okhttp3.{Request, Response}

import scala.concurrent.{ExecutionContext, Future}


case class FindAddressResult(Latitude: Float, Longitude: Float, Addresses: Seq[String])

object FindAddressResult {
  implicit val codec: Codec[FindAddressResult] = deriveCodec
}
case class FindAddressResultError(Message: String) extends RuntimeException(s"$Message")

object FindAddressResultError {
  implicit val codec: Codec[FindAddressResultError] = deriveCodec
}

class GetAddressIOService(config: GetAddressIOConfig, client: FutureHttpClient)(implicit executionContext: ExecutionContext)
  extends WebServiceHelper[FindAddressResultError] with LazyLogging {

  override val wsUrl: String = config.apiUrl
  override val httpClient: FutureHttpClient = client

  def find(postcode: String): Future[FindAddressResult] =
    get[FindAddressResult](postcode, Map("api-key" -> config.apiKey)).transform(x => x, y => y)
}
