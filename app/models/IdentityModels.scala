package models

import io.circe.generic.JsonCodec

//// Models the response of successfully creating a guest account.
////
//// Example response:
//// =================
//// {
////   "status": "ok",
////   "guestRegistrationRequest": {
////     "token": "83e41c1d-458d-49c0-b469-ddc263507034",
////     "userId": "100000190",
////     "timeIssued": "2018-02-28T14:46:01Z"
////   }
//// }
//@JsonCodec case class GuestRegistrationResponse(
//    guestRegistrationRequest: GuestRegistrationResponse.GuestRegistrationRequest
//)
//
//object GuestRegistrationResponse {
//  @JsonCodec case class GuestRegistrationRequest(userId: Long)
//}
//
//// Models the response of successfully looking up user details via email address.
////
//// Example response:
//// =================
//// {
////   "status": "ok",
////   "user": {
////     "id": "100000190",
////     "dates": {
////       "accountCreatedDate": "2018-02-28T14:46:01Z"
////     }
////   }
//// }
//@JsonCodec case class UserResponse(user: UserResponse.User)
//
//object UserResponse {
//  @JsonCodec case class User(id: Long)
//}
