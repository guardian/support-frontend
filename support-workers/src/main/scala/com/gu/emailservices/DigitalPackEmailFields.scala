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
          "subscription_details" -> "Group subscription"
        )
      }

    val fields = List(
      "zuorasubscriberid" -> subscriptionNumber,
      "emailaddress" -> user.primaryEmailAddress,
      "first_name" -> user.firstName,
      "last_name" -> user.lastName,
    ) ++ fieldsForReaderType

    val dataExtensionName = if (paidSubPaymentData.isDefined) "digipack" else "digipack-corp"

    EmailFields(fields, Left(sfContactId), user.primaryEmailAddress, dataExtensionName)
  }

  def paymentFields(paymentMethod: PaymentMethod, directDebitMandateId: Option[String]): Seq[(String, String)] =
    paymentMethod match {
      case dd: DirectDebitPaymentMethod => List(
        "account_number" -> mask(dd.bankTransferAccountNumber),
        "sort_code" -> hyphenate(dd.bankCode),
        "account_name" -> dd.bankTransferAccountName,
        "default_payment_method" -> "Direct Debit",
        "mandateid" -> directDebitMandateId.getOrElse("")
      )
      case dd: ClonedDirectDebitPaymentMethod => List(
        "sort_code" -> hyphenate(dd.bankCode),
        "account_number" -> mask(dd.bankTransferAccountNumber),
        "account_name" -> dd.bankTransferAccountName,
        "default_payment_method" -> "Direct Debit",
        "mandateid" -> dd.mandateId
      )
      case _: CreditCardReferenceTransaction => List("default_payment_method" -> "Credit/Debit Card")
      case _: PayPalReferenceTransaction => Seq("default_payment_method" -> "PayPal")
    }

  def directReaderFields(
    promotion: Option[Promotion],
    billingPeriod: BillingPeriod,
    user: User,
    currency: Currency,
    paymentSchedule: PaymentSchedule
  ): Seq[(String, String)] = {
    List(
      "subscription_term" -> billingPeriod.noun,
      "payment_amount" -> SubscriptionEmailFieldHelpers.formatPrice(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).amount),
      "country" -> user.billingAddress.country.name,
      "date_of_first_payment" -> formatDate(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date),
      "currency" -> currency.glyph,
      "trial_period" -> "14", //TODO: depends on Promo code or zuora config
      "subscription_details" -> SubscriptionEmailFieldHelpers.describe(paymentSchedule, billingPeriod, currency, promotion)
    )
  }

}
