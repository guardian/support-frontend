package models.identity.responses

import play.api.libs.json.{Json, Reads}

// Models the response of successfully looking up user details via email address.
//
// Example response:
// =================
// {
//   "status": "ok",
//   "userSignInDetails": {
//     "hasAccount": true,
//     "hasPassword": true,
//     "isUserEmailValidated": true,
//     "hasGoogleSocialLink": false,
//     "hasFacebookSocialLink": false
//   }
// }
case class UserSignInDetailsResponse(userSignInDetails: UserSignInDetailsResponse.UserSignInDetails)

object UserSignInDetailsResponse {

  implicit val readsUserSignInDetailsResponse: Reads[UserSignInDetailsResponse] = Json.reads[UserSignInDetailsResponse]
  case class UserSignInDetails(
    hasAccount: Boolean,
    hasPassword: Boolean,
    isUserEmailValidated: Boolean,
    hasGoogleSocialLink: Boolean,
    hasFacebookSocialLink: Boolean
  )

  object UserSignInDetails {
    implicit val readsUserSignInDetails: Reads[UserSignInDetails] = Json.reads[UserSignInDetails]
  }
}
