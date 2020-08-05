package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers._
import com.gu.i18n.Currency
import com.gu.support.promotions.Promotion
import com.gu.support.workers._
import com.gu.support.workers.states.PaymentMethodWithSchedule

object DigitalPackEmailFields {

  def build(
    subscriptionEmailFields: SubscriptionEmailFields,
    paidSubPaymentData: Option[PaymentMethodWithSchedule]
  ): EmailFields = {
    import subscriptionEmailFields._
    import allProductsEmailFields._

    val fieldsForReaderType =
      paidSubPaymentData match {
        case Some(PaymentMethodWithSchedule(pm, paymentSchedule)) =>
          paymentFields(pm, directDebitMandateId) ++
            directReaderFields(promotion, billingPeriod, user, currency, paymentSchedule)
        case None /*Corporate*/ => List(
          "Subscription details" -> "Group subscription"
        )
      }

    val fields = List(
      "ZuoraSubscriberId" -> subscriptionNumber,
      "EmailAddress" -> user.primaryEmailAddress,
      "First Name" -> user.firstName,
      "Last Name" -> user.lastName,
    ) ++ fieldsForReaderType

    val dataExtensionName = if (paidSubPaymentData.isDefined) "digipack" else "digipack-corp"

    EmailFields(fields, Left(sfContactId), user.primaryEmailAddress, dataExtensionName)
  }

  def paymentFields(paymentMethod: PaymentMethod, directDebitMandateId: Option[String]): Seq[(String, String)] =
    paymentMethod match {
      case dd: DirectDebitPaymentMethod => List(
        "Account number" -> mask(dd.bankTransferAccountNumber),
        "Sort Code" -> hyphenate(dd.bankCode),
        "Account Name" -> dd.bankTransferAccountName,
        "Default payment method" -> "Direct Debit",
        "MandateID" -> directDebitMandateId.getOrElse("")
      )
      case dd: ClonedDirectDebitPaymentMethod => List(
        "Sort Code" -> hyphenate(dd.bankCode),
        "Account number" -> mask(dd.bankTransferAccountNumber),
        "Account Name" -> dd.bankTransferAccountName,
        "Default payment method" -> "Direct Debit",
        "MandateID" -> dd.mandateId
      )
      case _: CreditCardReferenceTransaction => List("Default payment method" -> "Credit/Debit Card")
      case _: PayPalReferenceTransaction => Seq("Default payment method" -> "PayPal")
    }

  def directReaderFields(
    promotion: Option[Promotion],
    billingPeriod: BillingPeriod,
    user: User,
    currency: Currency,
    paymentSchedule: PaymentSchedule
  ): Seq[(String, String)] = {
    List(
      "Subscription term" -> billingPeriod.noun,
      "Payment amount" -> SubscriptionEmailFieldHelpers.formatPrice(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).amount),
      "Address 1" -> "", //TODO: Remove this from Braze template
      "Address 2" -> "", //TODO: Remove this from Braze template
      "City" -> "", //TODO: Remove this from Braze template
      "Post Code" -> "", //TODO: Remove this from Braze template
      "Country" -> user.billingAddress.country.name,
      "Date of first payment" -> formatDate(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date),
      "Currency" -> currency.glyph,
      "Trial period" -> "14", //TODO: depends on Promo code or zuora config
      "Subscription details" -> SubscriptionEmailFieldHelpers.describe(paymentSchedule, billingPeriod, currency, promotion)
    )
  }

}
