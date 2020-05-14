package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.{formatDate, hyphenate, mask}
import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.workers._
import com.gu.support.workers.redemption.RedemptionData
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
    paymentMethod: Either[PaymentMethod, RedemptionData],
    directDebitMandateId: Option[String] = None
) extends EmailFields {

  val paymentFields = paymentMethod match {
    case Left(dd: DirectDebitPaymentMethod) => List(
      "account name" -> dd.bankTransferAccountName,
      "account number" -> mask(dd.bankTransferAccountNumber),
      "sort code" -> hyphenate(dd.bankCode),
      "Mandate ID" -> directDebitMandateId.getOrElse(""),
      "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
      "payment method" -> "Direct Debit"
    )
    case Left(dd: ClonedDirectDebitPaymentMethod) => List(
      "account name" -> dd.bankTransferAccountName,
      "account number" -> mask(dd.bankTransferAccountNumber),
      "sort code" -> hyphenate(dd.bankCode),
      "Mandate ID" -> dd.mandateId,
      "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
      "payment method" -> "Direct Debit"
    )
    case Left(_: PayPalReferenceTransaction) => List("payment method" -> "PayPal")
    case Left(_: CreditCardReferenceTransaction) => List("payment method" -> "credit / debit card")
    case Right(_: RedemptionData) => Nil
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
