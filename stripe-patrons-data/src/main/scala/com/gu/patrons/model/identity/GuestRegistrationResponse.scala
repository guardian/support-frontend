package com.gu.patrons.model.identity

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

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
    guestRegistrationRequest: GuestRegistrationRequest,
)

case class GuestRegistrationRequest(userId: String)

object GuestRegistrationResponse {
  implicit val decoder: Decoder[GuestRegistrationResponse] = deriveDecoder
}

object GuestRegistrationRequest {
  implicit val decoder: Decoder[GuestRegistrationRequest] = deriveDecoder
}
