package com.gu.support.zuora.api

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object PreviewSubscribeItem {
  implicit val codec: Codec[PreviewSubscribeItem] = capitalizingCodec
}

case class PreviewSubscribeItem(
  account: Account,
  billToContact: ContactDetails,
  subscriptionData: SubscriptionData,
  subscribeOptions: SubscribeOptions,
  previewOptions: PreviewOptions
)

object PreviewSubscribeRequest {

  implicit val codec: Codec[PreviewSubscribeRequest] = deriveCodec

  def fromSubscribe(subscribeItem: SubscribeItem, numberOfBillingPeriodsToPreview: Int): PreviewSubscribeRequest = {
    PreviewSubscribeRequest(
      List(
        PreviewSubscribeItem(
          subscribeItem.account.copy(autoPay = false), //this is to work-around bug in Zuora where duplicate mandate would be created in GoCardless
          subscribeItem.billToContact,
          // This hack allows us to preview invoices further into the future (required to get a helpful payment schedule)
          if (numberOfBillingPeriodsToPreview > 1)
            subscribeItem.subscriptionData.copy(subscription = subscribeItem.subscriptionData.subscription.copy(initialTerm = 24))
          else
            subscribeItem.subscriptionData,
          subscribeItem.subscribeOptions,
          PreviewOptions(numberOfPeriods = numberOfBillingPeriodsToPreview)
        )
      )
    )
  }

}

//The subscribe request documented here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
//fields are upper case to match the expected json structure
case class PreviewSubscribeRequest(subscribes: List[PreviewSubscribeItem])
