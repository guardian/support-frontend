package models.identity.requests

import akka.util.ByteString
import com.gu.identity.play.PublicFields
import play.api.libs.json.{Json, Writes}
import play.api.libs.ws.{BodyWritable, InMemoryBody}

// Models a valid request to /guest
//
// Example request:
// =================
// {
//   "email": "a@b.com",
//   "publicFields": {
//     "displayName": "a"
//   }
// }
case class CreateGuestAccountRequestBody(primaryEmailAddress: String, publicFields: PublicFields)
object CreateGuestAccountRequestBody {

  def guestDisplayName(email: String): String = email.split("@").headOption.getOrElse("Guest User")

  def fromEmail(email: String): CreateGuestAccountRequestBody = CreateGuestAccountRequestBody(email, PublicFields(Some(guestDisplayName(email))))

  implicit val writesCreateGuestAccountRequestBody: Writes[CreateGuestAccountRequestBody] = Json.writes[CreateGuestAccountRequestBody]
  implicit val bodyWriteable: BodyWritable[CreateGuestAccountRequestBody] = BodyWritable[CreateGuestAccountRequestBody](
    transform = body => InMemoryBody(ByteString.fromString(Json.toJson(body).toString)),
    contentType = "application/json"
  )

}
