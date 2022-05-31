package com.gu.patrons.model.identity

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

// Models the response of successfully looking up user details via email address.
//
// Example response:
// =================
// {
//   "status": "ok",
//   "user": {
//     "id": "100000190",
//     "dates": {
//       "accountCreatedDate": "2018-02-28T14:46:01Z"
//     }
//   }
// }

case class UserResponse(user: User)

case class User(id: String)

object User {
  implicit val decoder: Decoder[User] = deriveDecoder
}

object UserResponse {
  implicit val decoder: Decoder[UserResponse] = deriveDecoder
}
