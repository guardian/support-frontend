package models.identity.responses

import play.api.libs.json.Json

case class IdentityApiResponseError(message: String, description: String, statusCode: Int = 500)

object IdentityApiResponseError {
  implicit val errorFormat = Json.format[IdentityApiResponseError]
}

