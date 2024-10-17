package model.stripe

import io.circe.generic.semiauto._
import io.circe.Encoder

sealed trait StripePaymentIntentsApiResponse

object StripePaymentIntentsApiResponse {
  case class Success() extends StripePaymentIntentsApiResponse

  case class RequiresAction(clientSecret: String) extends StripePaymentIntentsApiResponse

  implicit val successEncoder: Encoder.AsObject[Success] = deriveEncoder[Success]
  implicit val requiresActionEncoder: Encoder.AsObject[RequiresAction] = deriveEncoder[RequiresAction]
}
