package com.gu.support.workers.encoding

import com.gu.support.workers.model.state.CreatePaymentMethodState
import com.gu.support.workers.model.state.CreateSalesforceContactState
import com.gu.support.workers.model.state.CreateZuoraSubscriptionState
import com.gu.support.workers.model.state.SendThankYouEmailState
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.generic.semiauto._
import com.gu.salesforce.Salesforce._
import io.circe.Decoder
import com.gu.support.workers.encoding.Helpers.deriveCodec

object StateCodecs {
  implicit val createPaymentMethodState: Decoder[CreatePaymentMethodState] = deriveDecoder

  implicit val createSalesforceContactStateCodec: Codec[CreateSalesforceContactState] = deriveCodec
  implicit val createZuoraSubscriptionStateCodec: Codec[CreateZuoraSubscriptionState] = deriveCodec
  implicit val sendThankYouEmailStateCodec: Codec[SendThankYouEmailState] = deriveCodec
}
