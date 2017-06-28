package com.gu.membersDataAPI

import com.gu.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.typesafe.config.Config
import io.circe.Json
import okhttp3.Request

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._

object MembersDataServiceConfig {
  def fromConfig(config: Config): MembersDataServiceConfig =
    MembersDataServiceConfig(
      url = config.getString("membersDataAPI.url"),
      apiKey = config.getString("membersDataAPI.apiKey")
    )
}

class MembersDataServiceConfigProvider(defaultStage: Stage, config: Config) extends TouchpointConfigProvider[MembersDataServiceConfig](defaultStage, config) {
  def fromConfig(config: com.typesafe.config.Config): MembersDataServiceConfig = MembersDataServiceConfig(
    url = config.getString("membersDataAPI.url"),
    apiKey = config.getString("membersDataAPI.apiKey")
  )
}

case class MembersDataServiceConfig(url: String, apiKey: String) extends TouchpointConfig

case class ErrorResponse(message: String, details: String, statusCode: Int) extends Throwable(s"[$statusCode] $message - $details")

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

  override def wsPreExecute(req: Request.Builder): Request.Builder =
    req.addHeader("Authentication", s"Bearer ${config.apiKey}")

  def update(userId: String, isTestUser: Boolean): Future[UpdateResponse] =
    post[UpdateResponse](s"/users-attributes/$userId", Json.obj(), "testUser" -> isTestUser.toString)
}