package model.amazonpay

import io.circe.generic.JsonCodec

@JsonCodec case class AmazonPayResponse(guestAccountCreationToken: Option[String])
