package services

import play.api.libs.json.Json
import play.api.libs.ws.{WSClient, WSResponse}

import scala.concurrent.{ExecutionContext, Future}

class CaptchaService(wsClient: WSClient)(implicit ec: ExecutionContext) {
  val captchaEndpoint = "https://www.google.com/recaptcha/api/siteverify"
  val secret = "???"

  def verify(token: String): Future[WSResponse] =
    wsClient.url(captchaEndpoint)
    .withQueryStringParameters("secret" -> secret, "response" -> token)
    .withMethod("POST")
    .execute()
}
