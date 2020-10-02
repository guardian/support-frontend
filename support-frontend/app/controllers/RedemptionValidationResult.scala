package controllers

import com.gu.support.zuora.api.ReaderType
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder

case class RedemptionValidationResult(valid: Boolean, readerType: Option[ReaderType], errorMessage: Option[String])

object RedemptionValidationResult {
  implicit val encoder: Encoder[RedemptionValidationResult] = deriveEncoder
}
