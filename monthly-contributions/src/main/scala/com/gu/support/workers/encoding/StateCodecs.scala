package com.gu.support.workers.encoding

import com.gu.support.workers.model.state.CreatePaymentMethodState
import com.gu.support.workers.model.state.CreateSalesforceContactState
import com.gu.support.workers.model.state.CreateZuoraSubscriptionState
import com.gu.support.workers.model.state.SendThankYouEmailState
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.generic.semiauto._
import com.gu.salesforce.Salesforce._
import com.gu.support.workers.model.SalesforceContactRecord
import io.circe.{Decoder, Encoder}

object StateCodecs {
  implicit val createPaymentMethodState: Decoder[CreatePaymentMethodState] = deriveDecoder
  implicit val createSalesforceContactStateEncoder: Encoder[CreateSalesforceContactState] = deriveEncoder
  implicit val createSalesforceContactStateDecoder: Decoder[CreateSalesforceContactState] = deriveDecoder
  implicit val createZuoraSubscriptionStateEncoder: Encoder[CreateZuoraSubscriptionState] = deriveEncoder
  implicit val createZuoraSubscriptionStateDecoder: Decoder[CreateZuoraSubscriptionState] = deriveDecoder
  implicit val sendThankYouEmailStateEncoder: Encoder[SendThankYouEmailState] = deriveEncoder
  implicit val sendThankYouEmailStateDecoder: Decoder[SendThankYouEmailState] = deriveDecoder
}
