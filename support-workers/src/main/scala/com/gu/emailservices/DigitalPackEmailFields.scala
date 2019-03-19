package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.workers._
import com.gu.support.workers.states.{DirectDebitEmailPaymentFields, EmailPaymentFields}

// Output Json should look like this:
//
// {
//  "To": {
//    "Address": "gow5hckeqzc86qqx4rc@gu.com",
//    "SubscriberKey": "gow5hckeqzc86qqx4rc@gu.com",
//    "ContactAttributes": {
//      "SubscriberAttributes": {
//        "ZuoraSubscriberId": "A-S00045678",
//        "Date of first payment": "3 August 2018",
//        "Address 2": "",
//        "Trial period": "14",
//        "First Name": "first_GOW5hckeqZC86QQx4Rc",
//        "Last Name": "last_GOW5hckeqZC86QQx4Rc",
//        "Country": "United Kingdom",
//        "SubscriberKey": "gow5hckeqzc86qqx4rc@gu.com",
//        "Default payment method": "Credit/Debit Card",
//        "Currency": "£",
//        "Post Code": "N1 9AG",
//        "Subscription term": "month",
//        "City": "London",
//        "Subscription details": "£11.99 every month",
//        "EmailAddress": "gow5hckeqzc86qqx4rc@gu.com",
//        "Payment amount": "11.99",
//        "Address 1": "Kings Place"
//      }
//    }
//  },
//  "DataExtensionName": "digipack"
//}

case class DigitalPackEmailFields(
    subscriptionNumber: String,
    billingPeriod: BillingPeriod,
    user: User,
    paymentSchedule: PaymentSchedule,
    currency: Currency,
    paymentMethod: EmailPaymentFields,
    sfContactId: SfContactId,
) extends EmailFields {

  val paymentFields = paymentMethod match {
    case dd: DirectDebitEmailPaymentFields => List(
      "Account number" -> dd.bankAccountNumberMask,
      "Sort Code" -> hyphenate(dd.bankSortCode),
      "Account Name" -> dd.bankAccountName,
      "Default payment method" -> "Direct Debit",
      "MandateID" -> dd.mandateId.getOrElse("")
    )
    case other => List("Default payment method" -> other.description)
  }

  override val fields = List(
    "ZuoraSubscriberId" -> subscriptionNumber,
    "SubscriberKey" -> user.primaryEmailAddress,
    "EmailAddress" -> user.primaryEmailAddress,
    "Subscription term" -> billingPeriod.noun,
    "Payment amount" -> SubscriptionEmailFieldHelpers.formatPrice(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).amount),
    "First Name" -> user.firstName,
    "Last Name" -> user.lastName,
    "Address 1" -> "", //TODO: Remove this from Braze template
    "Address 2" -> "", //TODO: Remove this from Braze template
    "City" -> "", //TODO: Remove this from Braze template
    "Post Code" -> "", //TODO: Remove this from Braze template
    "Country" -> user.billingAddress.country.name,
    "Date of first payment" -> formatDate(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date),
    "Currency" -> currency.glyph,
    "Trial period" -> "14", //TODO: depends on Promo code
    "Subscription details" -> SubscriptionEmailFieldHelpers.describe(paymentSchedule, billingPeriod, currency)
  ) ++ paymentFields

  override def payload: String = super.payload(user.primaryEmailAddress, "digipack")
  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}
