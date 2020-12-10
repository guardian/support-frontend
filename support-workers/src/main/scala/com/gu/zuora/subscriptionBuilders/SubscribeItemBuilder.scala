package com.gu.zuora.subscriptionBuilders

import com.gu.support.workers.states.CreateZuoraSubscriptionState._
import com.gu.support.workers.{Address, PaymentMethod, SalesforceContactRecord}
import com.gu.support.zuora.api._

class SubscribeItemBuilder(state: CreateZuoraSubscriptionNewSubscriptionState, subscriptionData: SubscriptionData) {

  //Documentation for this request is here: https://www.zuora.com/developer/api-reference/#operation/Action_POSTsubscribe
  def build: SubscribeItem = (state, state.user.deliveryAddress, state.user.deliveryInstructions) match {
    case (state: CreateZuoraSubscriptionDigitalSubscriptionDirectPurchaseState, None, None) =>
      buildSubscribeItem(state.salesForceContact, Some(state.paymentMethod), None)
    case (state: CreateZuoraSubscriptionDigitalSubscriptionGiftPurchaseState, None, None) =>
      buildSubscribeItem(state.salesforceContacts.recipient, Some(state.paymentMethod), None)
    case (state: CreateZuoraSubscriptionDigitalSubscriptionCorporateRedemptionState, None, None) =>
      buildSubscribeItem(state.salesForceContact, None, None)
    case (state: CreateZuoraSubscriptionContributionState, None, None) =>
      buildSubscribeItem(state.salesForceContact, Some(state.paymentMethod), None)
    case (state: CreateZuoraSubscriptionPaperState, Some(deliveryAddress), maybeDeliveryInstructions) =>
      val user = state.user
      val soldToContact = buildContactDetails(Some(user.primaryEmailAddress), user.firstName, user.lastName, deliveryAddress, maybeDeliveryInstructions)
      buildSubscribeItem(state.salesForceContact, Some(state.paymentMethod), Some(soldToContact))
    case (state: CreateZuoraSubscriptionGuardianWeeklyState, Some(deliveryAddress), None) =>
      val soldToContact = state.giftRecipient match {
        case None => buildContactDetails(Some(state.user.primaryEmailAddress), state.user.firstName, state.user.lastName, deliveryAddress, None)
        case Some(gR) => buildContactDetails(gR.email, gR.firstName, gR.lastName, deliveryAddress, None)
      }
      buildSubscribeItem(state.salesforceContacts.recipient, Some(state.paymentMethod), Some(soldToContact))
    case _ =>
      // TODO deliveryAddress and deliveryInstructions should later be moved out of User and into the relevant case class
      throw new RuntimeException(s"delivery information was specified incorrectly for the product $state")
  }

  private def buildContactDetails(
    email: Option[String],
    firstName: String,
    lastName: String,
    address: Address,
    maybeDeliveryInstructions: Option[String] = None
  ) = ContactDetails(
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

  private def buildSubscribeItem(
    salesForceContact: SalesforceContactRecord,
    maybePaymentMethod: Option[PaymentMethod],
    soldToContact: Option[ContactDetails]
  ) = {
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
