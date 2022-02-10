package models.identity.responses

import play.api.libs.json.{Json, Reads}

// Models the response of successfully creating a guest account.
//
// Example response:
// =================
// {
//   "status": "ok",
//   "guestRegistrationRequest": {
//     "token": "83e41c1d-458d-49c0-b469-ddc263507034",
//     "userId": "100000190",
//     "timeIssued": "2018-02-28T14:46:01Z"
//   }
// }
case class GuestRegistrationResponse(
    guestRegistrationRequest: GuestRegistrationResponse.GuestRegistrationRequest,
)

object GuestRegistrationResponse {
  implicit val readsGuestRegistrationResponse: Reads[GuestRegistrationResponse] = Json.reads[GuestRegistrationResponse]
  case class GuestRegistrationRequest(userId: String)

  object GuestRegistrationRequest {
    implicit val readsGuestRegistrationRequest: Reads[GuestRegistrationRequest] = Json.reads[GuestRegistrationRequest]
  }
}
