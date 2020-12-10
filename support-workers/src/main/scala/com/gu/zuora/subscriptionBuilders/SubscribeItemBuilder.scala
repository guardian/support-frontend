package com.gu.zuora.subscriptionBuilders

import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.{Address, PaymentMethod, SalesforceContactRecord}
import com.gu.support.zuora.api._

object SubscribeItemBuilder {

  def buildContactDetails(
    email: Option[String],
    firstName: String,
    lastName: String,
    address: Address,
    maybeDeliveryInstructions: Option[String] = None
  ): ContactDetails = ContactDetails(
    firstName = firstName,
    lastName = lastName,
    workEmail = email,
    address1 = address.lineOne,
    address2 = address.lineTwo,
    city = address.city,
    postalCode = address.postCode,
    country = address.country,
    state = address.state,
    deliveryInstructions = maybeDeliveryInstructions
  )

  def buildSubscribeItem(
    state: CreateZuoraSubscriptionNewSubscriptionState,
    subscriptionData: SubscriptionData,
    salesForceContact: SalesforceContactRecord,
    maybePaymentMethod: Option[PaymentMethod],
    soldToContact: Option[ContactDetails]
  ): SubscribeItem = {
    val billingEnabled = maybePaymentMethod.isDefined
    SubscribeItem(
      account = Account(
        name = salesForceContact.AccountId, //We store the Salesforce Account id in the name field
        currency = state.product.currency,
        crmId = salesForceContact.AccountId, //Somewhere else we store the Salesforce Account id
        sfContactId__c = salesForceContact.Id,
        identityId__c = state.user.id,
        paymentGateway = maybePaymentMethod.map(_.paymentGateway),
        createdRequestId__c = state.requestId.toString,
        autoPay = maybePaymentMethod.isDefined
      ),
      billToContact = buildContactDetails(
        Some(state.user.primaryEmailAddress), state.user.firstName, state.user.lastName, state.user.billingAddress
      ),
      soldToContact = soldToContact,
      paymentMethod = maybePaymentMethod,
      subscriptionData = subscriptionData,
      subscribeOptions = SubscribeOptions(generateInvoice = billingEnabled, processPayments = billingEnabled)
    )
  }

}
