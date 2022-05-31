package com.gu.patrons.model.identity

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

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
) extends Throwable(errors.headOption.map(_.description).getOrElse(status))

case class IdentityError(
    message: String,
    description: String,
)

object IdentityErrorResponse {
  implicit val decoder: Decoder[IdentityErrorResponse] = deriveDecoder
}

object IdentityError {
  object InvalidEmailAddress {
    val message = "Registration Error"
    val description = "Please sign up using an email address from a different provider"
    val errorReasonCode = "invalid_email_address"
  }

  def isDisallowedEmailError(identityError: IdentityError): Boolean =
    identityError.message == InvalidEmailAddress.message &&
      identityError.description == InvalidEmailAddress.description

  implicit val decoder: Decoder[IdentityError] = deriveDecoder
}
