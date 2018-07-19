package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.support.workers.model.{DirectDebitPaymentMethod, PaymentMethod}
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

case class ContributionEmailFields(
    email: String,
    created: DateTime,
    amount: BigDecimal,
    currency: Currency,
    edition: String,
    name: String,
    product: String,
    paymentMethod: Option[PaymentMethod] = None,
    directDebitMandateId: Option[String] = None
) extends EmailFields {

  val paymentFields = paymentMethod match {
    case Some(dd: DirectDebitPaymentMethod) => List(
      "account name" -> dd.bankTransferAccountName,
      "account number" -> mask(dd.bankTransferAccountNumber),
      "sort code" -> hyphenate(dd.bankCode),
      "Mandate ID" -> directDebitMandateId.getOrElse(""),
      "first payment date" -> firstPaymentDate,
      "payment method" -> "Direct Debit"
    )
    case _ => Nil
  }

  override val fields = List(
    "EmailAddress" -> email,
    "created" -> created.toString,
    "amount" -> amount.toString,
    "currency" -> currency.glyph,
    "edition" -> edition,
    "name" -> name,
    "product" -> product
  ) ++ paymentFields

  override def payload = super.payload(email, "regular-contribution-thank-you")

  def firstPaymentDate: String = DateTimeFormat
    .forPattern("EEEE, d MMMM yyyy")
    .print(created.plusDays(10))

}
