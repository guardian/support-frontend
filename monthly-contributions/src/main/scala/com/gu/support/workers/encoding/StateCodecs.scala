package com.gu.support.workers.encoding

import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.gu.support.workers.model.monthlyContributions.state._
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.Decoder
import io.circe.generic.semiauto._

object StateCodecs {
  implicit val createPaymentMethodState: Decoder[CreatePaymentMethodState] = deriveDecoder
  implicit val createSalesforceContactStateCodec: Codec[CreateSalesforceContactState] = deriveCodec
  implicit val createZuoraSubscriptionStateCodec: Codec[CreateZuoraSubscriptionState] = deriveCodec
  implicit val sendThankYouEmailStateCodec: Codec[SendThankYouEmailState] = deriveCodec
  implicit val failureHandlerStateCodec: Codec[FailureHandlerState] = deriveCodec
}
