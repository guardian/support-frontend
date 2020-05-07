package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.promotions.Promotion
import com.gu.support.workers._
import com.gu.support.workers.states.{FreeProduct, PaidProduct, PaymentDetails}
import org.joda.time.LocalDate

//noinspection ScalaStyle
object PaperFieldsGenerator {

  def fieldsFor(
    subscriptionNumber: String,
    billingPeriod: BillingPeriod,
    user: User,
    paymentSchedule: PaymentSchedule,
    firstDeliveryDate: Option[LocalDate],
    currency: Currency,
    paymentMethod: PaymentDetails[PaymentMethod],
    sfContactId: SfContactId,
    directDebitMandateId: Option[String],
    promotion: Option[Promotion],
    giftRecipient: Option[GiftRecipient]
  ): List[(String, String)] = {

    val firstPaymentDate = SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date

    val paymentFields = getPaymentFields(paymentMethod, directDebitMandateId)

    val deliveryAddressFields = getAddressFields(user)

    val giftRecipientFields = giftRecipient.map(
      recipient =>
        List(
          "giftee_first_name" -> recipient.firstName,
          "giftee_last_name" -> recipient.lastName,
        )
    ).getOrElse(Nil)

    val fields = List(
      "ZuoraSubscriberId" -> subscriptionNumber,
      "EmailAddress" -> user.primaryEmailAddress,
      "subscriber_id" -> subscriptionNumber,
      "first_name" -> user.firstName,
      "last_name" -> user.lastName,
      "date_of_first_paper" -> SubscriptionEmailFieldHelpers.formatDate(firstDeliveryDate.getOrElse(firstPaymentDate)),
      "date_of_first_payment" -> SubscriptionEmailFieldHelpers.formatDate(firstPaymentDate),
      "subscription_rate" -> SubscriptionEmailFieldHelpers.describe(paymentSchedule, billingPeriod, currency, promotion, giftRecipient.isDefined)
    ) ++ paymentFields ++ deliveryAddressFields ++ giftRecipientFields

    fields
  }

  protected def getAddressFields(user: User)= {
    val address = user.deliveryAddress.getOrElse(user.billingAddress)

    List(
      "delivery_address_line_1" -> address.lineOne.getOrElse(""),
      "delivery_address_line_2" -> address.lineTwo.getOrElse(""),
      "delivery_address_town" -> address.city.getOrElse(""),
      "delivery_postcode" -> address.postCode.getOrElse(""),
      "delivery_country" -> address.country.name
    )
  }

  protected def getPaymentFields(
    paymentMethod: PaymentDetails[PaymentMethod],
    directDebitMandateId: Option[String]
  ): Seq[(String, String)] = paymentMethod match {
    case PaidProduct(dd: DirectDebitPaymentMethod) => List(
      "bank_account_no" -> SubscriptionEmailFieldHelpers.mask(dd.bankTransferAccountNumber),
      "bank_sort_code" -> SubscriptionEmailFieldHelpers.hyphenate(dd.bankCode),
      "account_holder" -> dd.bankTransferAccountName,
      "payment_method" -> "Direct Debit",
      "mandate_id" -> directDebitMandateId.getOrElse("")
    )
    case PaidProduct(dd: ClonedDirectDebitPaymentMethod) => List(
      "bank_account_no" -> SubscriptionEmailFieldHelpers.mask(dd.bankTransferAccountNumber),
      "bank_sort_code" -> SubscriptionEmailFieldHelpers.hyphenate(dd.bankCode),
      "account_holder" -> dd.bankTransferAccountName,
      "payment_method" -> "Direct Debit",
      "mandate_id" -> dd.mandateId
    )
    case PaidProduct(_: CreditCardReferenceTransaction) => List("payment_method" -> "Credit/Debit Card")
    case PaidProduct(_: PayPalReferenceTransaction) => List("payment_method" -> "PayPal")
    case FreeProduct => Nil
  }

}
