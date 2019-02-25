package models.identity.responses

import play.api.libs.json.{Json, Reads}

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
case class UserResponse(user: UserResponse.User)

object UserResponse {

  implicit val readsUserResponse: Reads[UserResponse] = Json.reads[UserResponse]
  case class User(id: String)

  object User {
    implicit val readsUser: Reads[User] = Json.reads[User]
  }
}
