package models.identity.responses

import models.identity.responses.IdentityErrorResponse.IdentityError
import play.api.libs.json.{Json, Reads}

// Models and error returned by Identity
//
// Example response:
// =================
//
// {
//    "status": "error",
//    "errors": [
//        {
//            "message": "Registration Error",
//            "description": "Please sign up using an email address from a different provider"
//        }
//    ]
//}

case class IdentityErrorResponse(
    status: String,
    errors: List[IdentityError],
)

object IdentityErrorResponse {
  implicit val reads: Reads[IdentityErrorResponse] = Json.reads[IdentityErrorResponse]

  case class IdentityError(
      message: String,
      description: String,
      context: String = "primaryEmailAddress",
  )

  object IdentityError {
    object InvalidEmailAddress {
      val message = "Invalid emailAddress:"
      val description = "Please enter a valid email address"
      val context = "primaryEmailAddress"
      val errorReasonCode = "invalid_email_address"
    }

    def isDisallowedEmailError(identityError: IdentityError): Boolean =
      identityError.message == InvalidEmailAddress.message &&
        identityError.description == InvalidEmailAddress.description

    implicit val reads: Reads[IdentityError] = Json.reads[IdentityError]
  }
}
