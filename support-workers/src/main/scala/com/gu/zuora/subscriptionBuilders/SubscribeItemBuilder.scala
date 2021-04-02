package com.gu.zuora.subscriptionBuilders

import com.gu.i18n.Currency
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.workers.{GeneratedGiftCode, PaymentMethod, SalesforceContactRecord, User}
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, LocalDate}

import java.util.UUID

class SubscribeItemBuilder(
  requestId: UUID,
  user: User,
  currency: Currency,
) {

  def build(
    subscriptionData: SubscriptionData,
    salesForceContact: SalesforceContactRecord,
    maybePaymentMethod: Option[PaymentMethod],
    soldToContact: Option[ContactDetails]
  ): SubscribeItem = {
    val billingEnabled = maybePaymentMethod.isDefined
    SubscribeItem(
      account = Account(
        name = salesForceContact.AccountId, //We store the Salesforce Account id in the name field
        currency = currency,
        crmId = salesForceContact.AccountId, //Somewhere else we store the Salesforce Account id
        sfContactId__c = salesForceContact.Id,
        identityId__c = user.id,
        paymentGateway = maybePaymentMethod.map(_.paymentGateway),
        createdRequestId__c = requestId.toString,
        autoPay = maybePaymentMethod.isDefined
      ),
      billToContact = ContactDetails.fromAddress(
        Some(user.primaryEmailAddress), user.firstName, user.lastName, user.billingAddress
      ),
      soldToContact = soldToContact,
      paymentMethod = maybePaymentMethod,
      subscriptionData = subscriptionData,
      subscribeOptions = SubscribeOptions(generateInvoice = billingEnabled, processPayments = billingEnabled)
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
    redemptionCode: Option[Either[GeneratedGiftCode, RedemptionCode]] = None,
    giftNotificationEmailDate: Option[LocalDate] = None,
  ): SubscriptionData =
    SubscriptionData(
      List(
        RatePlanData(
          RatePlan(productRatePlanId),
          ratePlanCharges,
          Nil
        )
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
        redemptionCode = redemptionCode,
        giftNotificationEmailDate = giftNotificationEmailDate,
      )
    )

}
