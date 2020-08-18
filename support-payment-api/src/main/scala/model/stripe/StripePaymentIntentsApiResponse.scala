package model.stripe

import io.circe.generic.semiauto._

sealed trait StripePaymentIntentsApiResponse

object StripePaymentIntentsApiResponse {
  case class Success(guestAccountCreationToken: Option[String]) extends StripePaymentIntentsApiResponse

  case class RequiresAction(clientSecret: String) extends StripePaymentIntentsApiResponse

  implicit val successEncoder = deriveEncoder[Success]
  implicit val requiresActionEncoder = deriveEncoder[RequiresAction]
}
