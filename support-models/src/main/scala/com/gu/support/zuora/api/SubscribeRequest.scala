package com.gu.support.zuora.api

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.JsonHelpers.JsonObjectExtensions
import com.gu.support.workers.PaymentMethod
import io.circe.{Encoder, Json}
import io.circe.generic.semiauto.deriveEncoder
import org.joda.time.LocalDate

object SubscribeItem {
  implicit val encoder: Encoder[SubscribeItem] = capitalizingEncoder
}

case class SubscribeItem(
    account: Account,
    billToContact: ContactDetails,
    soldToContact: Option[ContactDetails],
    paymentMethod: Option[PaymentMethod],
    subscriptionData: SubscriptionData,
    subscribeOptions: SubscribeOptions,
)

object SubscribeRequest {
  implicit val encoder: Encoder[SubscribeRequest] = deriveEncoder
}

//The subscribe request documented here: https://www.zuora.com/developer/api-references/older-api/operation/Action_POSTsubscribe/
//fields are upper case to match the expected json structure
case class SubscribeRequest(subscribes: List[SubscribeItem])

import com.gu.support.encoding.Codec._

object UpdateRedemptionDataRequest {
  implicit val encoder: Encoder[UpdateRedemptionDataRequest] = deriveEncoder[UpdateRedemptionDataRequest].mapJsonObject(
    _.renameField("gifteeIdentityId", "GifteeIdentityId__c")
      .renameField("requestId", "CreatedRequestId__c")
      .renameField("giftRedemptionDate", "GiftRedemptionDate__c"),
  )
}

case class UpdateRedemptionDataRequest(
    requestId: String,
    gifteeIdentityId: String,
    giftRedemptionDate: LocalDate,
    currentTerm: Int,
    currentTermPeriodType: PeriodType,
)

object DistributeRevenueRequest {
  implicit val encoder: Encoder[DistributeRevenueRequest] = deriveEncoder[DistributeRevenueRequest].mapJsonObject(
    _.add("distributionType", Json.fromString("Daily distribution"))
      .add("eventTypeSystemId", Json.fromString("DigitalSubscriptionGiftRedeemed")),
  )
}

case class DistributeRevenueRequest(
    recognitionStart: LocalDate,
    recognitionEnd: LocalDate,
)
