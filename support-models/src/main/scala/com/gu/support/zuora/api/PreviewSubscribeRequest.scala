package com.gu.support.zuora.api

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder

object PreviewSubscribeItem {
  implicit val encoder: Encoder[PreviewSubscribeItem] = capitalizingEncoder
}

case class PreviewSubscribeItem(
    account: Account,
    billToContact: ContactDetails,
    subscriptionData: SubscriptionData,
    subscribeOptions: SubscribeOptions,
    previewOptions: PreviewOptions,
)

object PreviewSubscribeRequest {

  implicit val encoder: Encoder[PreviewSubscribeRequest] = deriveEncoder

  def fromSubscribe(subscribeItem: SubscribeItem, numberOfBillingPeriodsToPreview: Int): PreviewSubscribeRequest = {
    val initialTerm = subscribeItem.subscriptionData.subscription.initialTerm
    PreviewSubscribeRequest(
      List(
        PreviewSubscribeItem(
          subscribeItem.account.copy(autoPay =
            false,
          ), // this is to work-around bug in Zuora where duplicate mandate would be created in GoCardless
          subscribeItem.billToContact,
          // This hack allows us to preview invoices further into the future (required to get a helpful payment schedule)
          subscribeItem.subscriptionData
            .copy(subscription = subscribeItem.subscriptionData.subscription.copy(initialTerm = initialTerm * 2)),
          subscribeItem.subscribeOptions,
          PreviewOptions(numberOfPeriods = numberOfBillingPeriodsToPreview),
        ),
      ),
    )
  }

}

//The subscribe request documented here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
//fields are upper case to match the expected json structure
case class PreviewSubscribeRequest(subscribes: List[PreviewSubscribeItem])
