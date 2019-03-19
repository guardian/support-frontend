package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.workers._
import com.gu.support.workers.states.{DirectDebitEmailPaymentFields, EmailPaymentFields, NonDirectDebitEmailPaymentFields}
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
    paymentMethod: EmailPaymentFields,
) extends EmailFields {

  val paymentFields = paymentMethod match {
    case dd: DirectDebitEmailPaymentFields => List(
      "account name" -> dd.bankAccountName,
      "account number" -> dd.bankAccountNumberMask,
      "sort code" -> hyphenate(dd.bankSortCode),
      "Mandate ID" -> dd.mandateId.getOrElse(""),
      "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
      "payment method" -> "Direct Debit"
    )
    case otherMethod: NonDirectDebitEmailPaymentFields => List("payment method" -> otherMethod.description )

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
