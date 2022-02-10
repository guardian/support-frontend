package models.identity.requests

import akka.util.ByteString
import com.gu.identity.model.{PrivateFields, PublicFields}
import play.api.libs.json.{Json, Writes}
import play.api.libs.ws.{BodyWritable, InMemoryBody}

// Models a valid request to /guest
//
// Example request:
// =================
// {
//   "email": "a@b.com",
//   "privateFields": {
//     "firstName": "a",
//     "secondName": "b"
//   }
// }
case class CreateGuestAccountRequestBody(primaryEmailAddress: String, privateFields: PrivateFields)
object CreateGuestAccountRequestBody {

  implicit val writesCreateGuestAccountRequestBody: Writes[CreateGuestAccountRequestBody] = {
    import com.gu.identity.model.play.WritesInstances.privateFieldsWrites
    Json.writes[CreateGuestAccountRequestBody]
  }
  implicit val bodyWriteable: BodyWritable[CreateGuestAccountRequestBody] = BodyWritable[CreateGuestAccountRequestBody](
    transform = body => InMemoryBody(ByteString.fromString(Json.toJson(body).toString)),
    contentType = "application/json",
  )

}
