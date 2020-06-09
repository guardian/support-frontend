package controllers

case class RedemptionValidationResult(valid: Boolean, errorMessage: Option[String])

import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder

object RedemptionValidationResult {
  implicit val encoder: Encoder[RedemptionValidationResult] = deriveEncoder
}
