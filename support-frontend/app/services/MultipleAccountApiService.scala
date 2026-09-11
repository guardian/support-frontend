package services

import config.MultipleAccountApiConfig
import play.api.libs.ws.{WSClient, WSResponse}
import play.utils.UriEncoding

import scala.concurrent.Future

object MultipleAccountApiService {
  def invitationUrl(baseUrl: String, invitationCode: String, suffix: String = ""): String = {
    val encodedCode = UriEncoding.encodePathSegment(invitationCode, "utf-8")
    s"$baseUrl/invitation/$encodedCode$suffix"
  }
}

class MultipleAccountApiService(config: MultipleAccountApiConfig)(implicit wsClient: WSClient) {

  def getInvitation(invitationCode: String): Future[WSResponse] =
    wsClient
      .url(MultipleAccountApiService.invitationUrl(config.baseUrl, invitationCode))
      .withHttpHeaders("x-api-key" -> config.apiKey)
      .get()

  def acceptInvitation(
      invitationCode: String,
      identityId: String,
      accessToken: String,
  ): Future[WSResponse] =
    wsClient
      .url(MultipleAccountApiService.invitationUrl(config.baseUrl, invitationCode, "/accept"))
      .withHttpHeaders(
        "x-api-key" -> config.apiKey,
        "x-identity-id" -> identityId,
        "Authorization" -> s"Bearer $accessToken",
        "Content-Type" -> "application/json",
      )
      .execute("POST")

  def deleteInvitation(invitationCode: String, identityId: String): Future[WSResponse] =
    wsClient
      .url(MultipleAccountApiService.invitationUrl(config.baseUrl, invitationCode))
      .withHttpHeaders(
        "x-api-key" -> config.apiKey,
        "x-identity-id" -> identityId,
      )
      .execute("DELETE")
}
