package com.gu.support.zuora.api.response

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.JsonHelpers.JsonObjectExtensions
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import org.joda.time.LocalDate
import com.gu.support.encoding.CustomCodecs._

object AccountQueryResponse {
  implicit val codec: Codec[AccountQueryResponse] = deriveCodec
}

object PaymentMethodQueryResponse {
  implicit val codec: Codec[PaymentMethodQueryResponse] = deriveCodec
}

object SubscriptionRedemptionQueryResponse {
  implicit val decoder: Decoder[SubscriptionRedemptionQueryResponse] = deriveDecoder
}

object AccountRecord {
  implicit val codec: Codec[AccountRecord] = deriveCodec
}

object PaymentMethodRecord {
  implicit val codec: Codec[PaymentMethodRecord] = deriveCodec
}

object SubscriptionRedemptionFields {
  implicit val decoder: Decoder[SubscriptionRedemptionFields] = decapitalizingDecoder[SubscriptionRedemptionFields]
    .prepare(
      _.withFocus(
        _.mapObject(
          _.renameField("CreatedRequestId__c", "CreatedRequestId")
            .renameField("GifteeIdentityId__c", "GifteeIdentityId"),
        ),
      ),
    )
}

case class AccountQueryResponse(records: List[AccountRecord])

case class PaymentMethodQueryResponse(records: List[PaymentMethodRecord])

case class AccountRecord(AccountNumber: String, CreatedRequestId__c: Option[String])

case class PaymentMethodRecord(DefaultPaymentMethodId: String)

case class SubscriptionRedemptionQueryResponse(records: List[SubscriptionRedemptionFields])

case class SubscriptionRedemptionFields(
    id: String,
    contractEffectiveDate: LocalDate,
    createdRequestId: String,
    gifteeIdentityId: Option[String],
)
