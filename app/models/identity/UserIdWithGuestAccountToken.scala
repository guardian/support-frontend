package models.identity

import models.identity.responses.GuestRegistrationResponse

// A userId with an optional guest account registration toke (created when a guest account is registered)
case class UserIdWithGuestAccountToken(userId: String, guestAccountRegistrationToken: Option[String])

object UserIdWithGuestAccountToken {
  def fromGuestRegistrationResponse(guestRegistrationResponse: GuestRegistrationResponse): UserIdWithGuestAccountToken =
    UserIdWithGuestAccountToken(
      guestRegistrationResponse.guestRegistrationRequest.userId,
      guestRegistrationResponse.guestRegistrationRequest.token
    )
}
