package controllers

case class RedemptionValidationResult(valid: Boolean, errorMessage: Option[String])

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object RedemptionValidationResult {
  implicit val codec: Codec[RedemptionValidationResult] = deriveCodec
}
