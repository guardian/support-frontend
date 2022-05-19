package com.gu.patrons.model.identity

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

// Models a valid request to /guest
//
// Example request:
// =================
// {
//   "primaryEmailAddress": "a@b.com",
//   "privateFields": {
//     "firstName": "a",
//     "secondName": "b"
//   }
// }
case class CreateGuestAccountRequestBody(primaryEmailAddress: String, privateFields: PrivateFields)

case class PrivateFields(firstName: String, secondName: String)

object CreateGuestAccountRequestBody {
  implicit val encoder: Encoder[CreateGuestAccountRequestBody] = deriveEncoder
}

object PrivateFields {
  implicit val encoder: Encoder[PrivateFields] = deriveEncoder
}
