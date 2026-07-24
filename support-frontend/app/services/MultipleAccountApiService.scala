package services

import config.MultipleAccountApiConfig
import play.api.libs.ws.{WSClient, WSResponse}

import scala.concurrent.Future

class MultipleAccountApiService(config: MultipleAccountApiConfig)(implicit wsClient: WSClient) {

  def getInvitation(invitationId: String): Future[WSResponse] =
    wsClient
      .url(s"${config.baseUrl}/invitation/$invitationId")
      .withHttpHeaders("x-api-key" -> config.apiKey)
      .get()
}
