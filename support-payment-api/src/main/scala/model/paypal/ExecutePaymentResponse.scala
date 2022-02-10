package model.paypal

import io.circe.generic.JsonCodec

@JsonCodec case class ExecutePaymentResponse(email: Option[String])
