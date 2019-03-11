package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{FulfilmentOptions, HomeDelivery, ProductOptions}
import com.gu.support.workers._
import org.joda.time.LocalDate

case class PaperEmailFields(
  subscriptionNumber: String,
  fulfilmentOptions: FulfilmentOptions,
  productOptions: ProductOptions,
  billingPeriod: BillingPeriod,
  user: User,
  paymentSchedule: PaymentSchedule,
  firstDeliveryDate: Option[LocalDate],
  currency: Currency,
  paymentMethod: PaymentMethod,
  sfContactId: SfContactId,
  directDebitMandateId: Option[String] = None
) extends EmailFields {

  val dataExtension = fulfilmentOptions match {
    case HomeDelivery => "paper-delivery"
    case _ => "paper-voucher"
  }

  val firstPaymentDate = SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date

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
      "delivery_postcode" -> address.postCode.getOrElse(""),
      "delivery_country" -> address.country.name
    )
  }

  override val fields = List(
    "ZuoraSubscriberId" -> subscriptionNumber, //TODO why do we need to send all of this stuff twice?
    "SubscriberKey" -> user.primaryEmailAddress,
    "EmailAddress" -> user.primaryEmailAddress,
    "subscriber_id" -> subscriptionNumber,
    "first_name" -> user.firstName,
    "last_name" -> user.lastName,
    "date_of_first_paper" -> formatDate(firstDeliveryDate.getOrElse(firstPaymentDate)),
    "date_of_first_payment" -> formatDate(firstPaymentDate),
    "package" -> productOptions.toString,
    "subscription_rate" -> SubscriptionEmailFieldHelpers.describe(paymentSchedule, billingPeriod, currency)
  ) ++ paymentFields ++ deliveryAddressFields.getOrElse(List())

  //TODO - do we care about the billing and promotion fields - these are included in the emails queued via subscriptions-frontend?

  override def payload: String = super.payload(user.primaryEmailAddress, dataExtension)
  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}
