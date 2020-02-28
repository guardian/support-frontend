package models.identity.requests

import akka.util.ByteString
import play.api.libs.json.{Json, Writes}
import play.api.libs.ws.{BodyWritable, InMemoryBody}

// Models a valid request to /guest
//
// Example request:
// =================
// {
//   "email": "a@b.com"
// }
case class CreateGuestAccountRequestBody(primaryEmailAddress: String)
object CreateGuestAccountRequestBody {

  def fromEmail(email: String): CreateGuestAccountRequestBody =
    CreateGuestAccountRequestBody(email)

  implicit val writesCreateGuestAccountRequestBody: Writes[CreateGuestAccountRequestBody] = {
    import com.gu.identity.model.play.WritesInstances.publicFieldsWrites
    Json.writes[CreateGuestAccountRequestBody]
  }
  implicit val bodyWriteable: BodyWritable[CreateGuestAccountRequestBody] = BodyWritable[CreateGuestAccountRequestBody](
    transform = body => InMemoryBody(ByteString.fromString(Json.toJson(body).toString)),
    contentType = "application/json"
  )

}
