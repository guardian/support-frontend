package com.gu.zuora.model

//The subscribe request documented here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
//fields are upper case to match the expected json structure
case class SubscribeRequest(subscribes: List[SubscribeItem])

case class SubscribeItem(
  account: Account,
  billToContact: ContactDetails,
  paymentMethod: PaymentMethod,
  subscriptionData: SubscriptionData,
  subscribeOptions: SubscribeOptions)
