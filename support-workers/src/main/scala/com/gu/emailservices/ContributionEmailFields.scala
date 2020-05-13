package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.{formatDate, hyphenate, mask}
import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.workers._
import com.gu.support.workers.states.{FreeProduct, PaidProduct, PaymentDetails}
import org.joda.time.DateTime

case class ContributionEmailFields(
    email: String,
    created: DateTime,
    amount: BigDecimal,
    currency: Currency,
    edition: String,
    name: String,
    billingPeriod: BillingPeriod,
    sfContactId: SfContactId,
    paymentMethod: PaymentDetails[PaymentMethod],
    directDebitMandateId: Option[String] = None
) extends EmailFields {

  val paymentFields = paymentMethod match {
    case PaidProduct(dd: DirectDebitPaymentMethod) => List(
      "account name" -> dd.bankTransferAccountName,
      "account number" -> mask(dd.bankTransferAccountNumber),
      "sort code" -> hyphenate(dd.bankCode),
      "Mandate ID" -> directDebitMandateId.getOrElse(""),
      "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
      "payment method" -> "Direct Debit"
    )
    case PaidProduct(dd: ClonedDirectDebitPaymentMethod) => List(
      "account name" -> dd.bankTransferAccountName,
      "account number" -> mask(dd.bankTransferAccountNumber),
      "sort code" -> hyphenate(dd.bankCode),
      "Mandate ID" -> dd.mandateId,
      "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
      "payment method" -> "Direct Debit"
    )
    case PaidProduct(_: PayPalReferenceTransaction) => List("payment method" -> "PayPal")
    case PaidProduct(_: CreditCardReferenceTransaction) => List("payment method" -> "credit / debit card")
    case FreeProduct => Nil
  }

  override val fields = List(
    "EmailAddress" -> email,
    "created" -> created.toString,
    "amount" -> amount.toString,
    "currency" -> currency.identifier,
    "edition" -> edition,
    "name" -> name,
    "product" -> s"${billingPeriod.toString.toLowerCase}-contribution"
  ) ++ paymentFields

  override def payload: String = super.payload(email, "regular-contribution-thank-you")

  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}
