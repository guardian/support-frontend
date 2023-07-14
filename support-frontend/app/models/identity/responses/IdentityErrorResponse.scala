package models.identity.responses

import models.identity.responses.IdentityErrorResponse.IdentityError
import play.api.libs.json.{Json, Reads, JsPath}
import play.api.libs.functional.syntax._

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
  val emailProviderRejectedCode = "email_provider_rejected"
  val invalidEmailAddressCode = "invalid_email_address"

  sealed trait IdentityError {
    def endpoint: Option[IdentityEndpoint]
    def setEndpoint(e: IdentityEndpoint): IdentityError = {
      this match {
        case EmailProviderRejected(_) => EmailProviderRejected(Some(e))
        case InvalidEmailAddress(_) => InvalidEmailAddress(Some(e))
        case OtherIdentityError(m, d, _endpoint) => OtherIdentityError(m, d, endpoint = Some(e))
      }
    }
  }

  /** We don’t accept email addresses from this provider. */
  case class EmailProviderRejected(endpoint: Option[IdentityEndpoint]) extends IdentityError

  /** The email address is invalid. */
  case class InvalidEmailAddress(endpoint: Option[IdentityEndpoint]) extends IdentityError

  /** Some other error occurred. */
  case class OtherIdentityError(message: String, description: String, endpoint: Option[IdentityEndpoint])
      extends IdentityError

  sealed trait IdentityEndpoint
  case object UserEndpoint extends IdentityEndpoint
  case object GuestEndpoint extends IdentityEndpoint

  object IdentityError {
    implicit val reads: Reads[IdentityError] = (
      (JsPath \ "message").read[String] and
        (JsPath \ "description").read[String]
    ) { (message, description) =>
      if (
        message == "Registration Error" && description == "Please sign up using an email address from a different provider"
      ) {
        EmailProviderRejected(endpoint = None)
      } else if (message == "Invalid emailAddress:" && description == "Please enter a valid email address") {
        InvalidEmailAddress(endpoint = None)
      } else {
        OtherIdentityError(message, description, endpoint = None)
      }
    }
  }
}
