package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.ProductOptions
import com.gu.support.workers._

case class PaperEmailFields(
  subscriptionNumber: String,
  productOptions: ProductOptions,
  billingPeriod: BillingPeriod,
  user: User,
  paymentSchedule: PaymentSchedule,
  currency: Currency,
  paymentMethod: PaymentMethod,
  sfContactId: SfContactId,
  directDebitMandateId: Option[String] = None
) extends EmailFields {

  val paymentFields = paymentMethod match {
    case dd: DirectDebitPaymentMethod => List(
      "bank_account_no" -> mask(dd.bankTransferAccountNumber),
      "bank_sort_code" -> hyphenate(dd.bankCode),
      "account_holder" -> dd.bankTransferAccountName,
      "payment_method" -> "Direct Debit",
      "mandate_id" -> directDebitMandateId.getOrElse("")
    )
    case _: CreditCardReferenceTransaction => List("payment_method" -> "Credit/Debit Card")
    case _: PayPalReferenceTransaction => List("payment_method" -> "PayPal")
  }

  val deliveryAddressFields = user.deliveryAddress.map { address =>
    List(
      "delivery_address_line_1" -> address.lineOne.getOrElse(""),
      "delivery_address_line_2" -> address.lineTwo.getOrElse(""),
      "delivery_address_town" -> address.city.getOrElse(""),
//      "delivery_county" -> "", //TODO we don't collect this via the checkout anymore - do we need to send it at all?
      "delivery_postcode" -> address.postCode.getOrElse(""),
      "delivery_country" -> address.country.name
    )
  }

  override val fields = List(
    "ZuoraSubscriberId" -> subscriptionNumber, //TODO why do we need all of this stuff twice?
    "SubscriberKey" -> user.primaryEmailAddress,
    "EmailAddress" -> user.primaryEmailAddress,
    "subscriber_id" -> subscriptionNumber,
    "IncludesDigipack" -> "false", //FIXME - hardcoded for now
    "title" -> "", //FIXME - do we have or need this?
    "first_name" -> user.firstName,
    "last_name" -> user.lastName,
    "date_of_first_paper" -> formatDate(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date), //FIXME is this always going to be true?
    "date_of_first_payment" -> formatDate(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date),
    "package" -> productOptions.toString,
    "subscription_rate" -> SubscriptionEmailFieldHelpers.describe(paymentSchedule, billingPeriod, currency),
//    "delivery_instructions" -> "" //TODO we don't collect this via the checkout anymore - do we need to send it at all?
  ) ++ paymentFields ++ deliveryAddressFields.getOrElse(List())

  //TODO do we care about the billing and promotion fields - these are included in the emails queued via subscriptions-frontend?

  override def payload: String = super.payload(user.primaryEmailAddress, "paper-delivery")
  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}
