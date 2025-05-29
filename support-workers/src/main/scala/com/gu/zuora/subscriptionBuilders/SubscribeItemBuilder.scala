package com.gu.zuora.subscriptionBuilders

import com.gu.i18n.Country.Australia
import com.gu.i18n.Currency.AUD
import com.gu.i18n.{Country, Currency}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.paperround.AgentId
import com.gu.support.workers.{Address, PaymentMethod, SalesforceContactRecord, User}
import com.gu.support.zuora.api.AcquisitionSource.CSR
import com.gu.support.zuora.api._
import com.gu.zuora.subscriptionBuilders.SubscribeItemBuilder.buildContactDetails
import org.joda.time.{DateTimeZone, LocalDate}

import java.util.UUID

class SubscribeItemBuilder(
    requestId: UUID,
    user: User,
    currency: Currency,
    today: LocalDate,
) {

  def build(
      subscriptionData: SubscriptionData,
      salesForceContact: SalesforceContactRecord,
      maybePaymentMethod: Option[PaymentMethod],
      soldToContact: Option[ContactDetails],
  ): SubscribeItem = {
    val billingEnabled = maybePaymentMethod.isDefined
    SubscribeItem(
      account = buildAccount(salesForceContact, maybePaymentMethod),
      billToContact = buildContactDetails(
        Some(user.primaryEmailAddress),
        user.firstName,
        user.lastName,
        user.billingAddress,
      ),
      soldToContact = soldToContact,
      paymentMethod = maybePaymentMethod,
      subscriptionData = subscriptionData,
      subscribeOptions = SubscribeOptions(generateInvoice = billingEnabled, processPayments = billingEnabled),
    )
  }

  private def buildAccount(
      salesForceContact: SalesforceContactRecord,
      maybePaymentMethod: Option[PaymentMethod],
  ) = {
    Account(
      name = salesForceContact.AccountId, // We store the Salesforce Account id in the name field
      currency = currency,
      crmId = salesForceContact.AccountId, // Somewhere else we store the Salesforce Account id
      sfContactId__c = salesForceContact.Id,
      identityId__c = user.id,
      paymentGateway = maybePaymentMethod.map(_.PaymentGateway),
      createdRequestId__c = requestId.toString,
      autoPay = maybePaymentMethod.isDefined,
    )
  }

  def buildProductSubscription(
      productRatePlanId: ProductRatePlanId,
      ratePlanCharges: List[RatePlanChargeData] = Nil,
      contractEffectiveDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
      contractAcceptanceDate: LocalDate = LocalDate.now(DateTimeZone.UTC),
      readerType: ReaderType,
      autoRenew: Boolean = true,
      initialTerm: Int = 12,
      initialTermPeriodType: PeriodType = Month,
      giftNotificationEmailDate: Option[LocalDate] = None,
      csrUsername: Option[String] = None,
      salesforceCaseId: Option[String] = None,
      deliveryAgent: Option[AgentId] = None,
  ): SubscriptionData =
    SubscriptionData(
      List(
        RatePlanData(
          RatePlan(productRatePlanId),
          ratePlanCharges,
          Nil,
        ),
      ),
      Subscription(
        contractEffectiveDate = contractEffectiveDate,
        contractAcceptanceDate = contractAcceptanceDate,
        termStartDate = contractEffectiveDate,
        createdRequestId = requestId.toString,
        readerType = readerType,
        autoRenew = autoRenew,
        initialTerm = initialTerm,
        initialTermPeriodType = initialTermPeriodType,
        giftNotificationEmailDate = giftNotificationEmailDate,
        createdByCsr = csrUsername,
        acquisitionSource = csrUsername.map(_ => CSR),
        acquisitionCase = salesforceCaseId,
        deliveryAgent = deliveryAgent,
        lastPlanAddedDate = today,
      ),
    )
}

object SubscribeItemBuilder {

  def buildContactDetails(
      email: Option[String],
      firstName: String,
      lastName: String,
      address: Address,
      maybeDeliveryInstructions: Option[String] = None,
  ): ContactDetails = new ContactDetails(
    firstName = firstName,
    lastName = lastName,
    workEmail = email,
    address1 = address.lineOne,
    address2 = address.lineTwo,
    city = address.city,
    postalCode = address.postCode,
    country = address.country,
    state = address.state,
    deliveryInstructions = maybeDeliveryInstructions,
  )

}
