package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers._
import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.promotions.Promotion
import com.gu.support.workers._
import com.gu.support.workers.states.{FreeProduct, PaidProduct, PaymentDetails}

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
//        "Country": "United Kingdom"
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
    paymentMethod: PaymentDetails[PaymentMethod],
    sfContactId: SfContactId,
    directDebitMandateId: Option[String] = None,
    promotion: Option[Promotion] = None
) extends EmailFields {

  val paymentFields = paymentMethod match {
    case PaidProduct(dd: DirectDebitPaymentMethod) => List(
      "Account number" -> mask(dd.bankTransferAccountNumber),
      "Sort Code" -> hyphenate(dd.bankCode),
      "Account Name" -> dd.bankTransferAccountName,
      "Default payment method" -> "Direct Debit",
      "MandateID" -> directDebitMandateId.getOrElse("")
    )
    case PaidProduct(dd: ClonedDirectDebitPaymentMethod) => List(
      "Sort Code" -> hyphenate(dd.bankCode),
      "Account number" -> mask(dd.bankTransferAccountNumber),
      "Account Name" -> dd.bankTransferAccountName,
      "Default payment method" -> "Direct Debit",
      "MandateID" -> dd.mandateId
    )
    case PaidProduct(_: CreditCardReferenceTransaction) => List("Default payment method" -> "Credit/Debit Card")
    case PaidProduct(_: PayPalReferenceTransaction) => Seq("Default payment method" -> "PayPal")
    case FreeProduct => Nil
  }

  override val fields = List(
    "ZuoraSubscriberId" -> subscriptionNumber,
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
    "Subscription details" -> SubscriptionEmailFieldHelpers.describe(paymentSchedule, billingPeriod, currency, promotion)
  ) ++ paymentFields

  override def payload: String = super.payload(user.primaryEmailAddress, "digipack")
  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}
