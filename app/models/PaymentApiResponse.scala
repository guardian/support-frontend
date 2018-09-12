package models

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class PaymentAPIResponse[E, S](`type`: String, error: Option[E], data: Option[S])

object PaymentAPIResponse {
  implicit def paymentAPIResponseDecoder[E: Decoder, S: Decoder]: Decoder[PaymentAPIResponse[E, S]] = deriveDecoder
}
