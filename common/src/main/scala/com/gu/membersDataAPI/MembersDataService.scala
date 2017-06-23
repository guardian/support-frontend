package com.gu.membersDataAPI

import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._

case class MembersDataServiceConfig(url: String, apiKey: String)

case class ErrorResponse(error: String) extends Throwable

object ErrorResponse {
  implicit val codec: Codec[ErrorResponse] = deriveCodec
}

case class UpdateResponse(updated: Boolean)

object UpdateResponse {
  implicit val codec: Codec[UpdateResponse] = deriveCodec
}

class MembersDataService(config: MembersDataServiceConfig)(implicit ec: ExecutionContext)
    extends WebServiceHelper[ErrorResponse] {

  override val wsUrl: String = config.url
  override val httpClient: FutureHttpClient = RequestRunners.configurableFutureRunner(30.seconds)

  def update(userId: String): Future[UpdateResponse] =
    put[UpdateResponse](s"/users-attributes/$userId")
}