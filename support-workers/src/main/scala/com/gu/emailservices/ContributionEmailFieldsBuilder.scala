package com.gu.emailservices

import com.gu.emailservices.ContributionEmailFieldsBuilder._
import com.gu.emailservices.SubscriptionEmailFieldHelpers.{formatDate, hyphenate, mask}
import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.workers._
import org.joda.time.DateTime

case class ContributionEmailFieldsBuilder(
  created: DateTime,
  amount: BigDecimal,
  paymentMethod: PaymentMethod
) extends AllProductsEmailFieldsBuilder {

  def buildWith(
    billingPeriod: BillingPeriod,
    user: User,
    currency: Currency,
    sfContactId: SfContactId,
    directDebitMandateId: Option[String],
  ): EmailFields = {

    val fields = List(
      "EmailAddress" -> user.primaryEmailAddress,
      "created" -> created.toString,
      "amount" -> amount.toString,
      "currency" -> currency.identifier,
      "edition" -> user.billingAddress.country.alpha2,
      "name" -> user.firstName,
      "product" -> s"${billingPeriod.toString.toLowerCase}-contribution"
    ) ++ getPaymentFields(paymentMethod, directDebitMandateId, created)

    EmailFields(fields, Left(sfContactId), user.primaryEmailAddress, "regular-contribution-thank-you")
  }

}

object ContributionEmailFieldsBuilder {

  def getPaymentFields(paymentMethod: PaymentMethod, directDebitMandateId: Option[String], created: DateTime): Seq[(String, String)] = {
    paymentMethod match {
      case dd: DirectDebitPaymentMethod => List(
        "account name" -> dd.bankTransferAccountName,
        "account number" -> mask(dd.bankTransferAccountNumber),
        "sort code" -> hyphenate(dd.bankCode),
        "Mandate ID" -> directDebitMandateId.getOrElse(""),
        "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
        "payment method" -> "Direct Debit"
      )
      case dd: ClonedDirectDebitPaymentMethod => List(
        "account name" -> dd.bankTransferAccountName,
        "account number" -> mask(dd.bankTransferAccountNumber),
        "sort code" -> hyphenate(dd.bankCode),
        "Mandate ID" -> dd.mandateId,
        "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
        "payment method" -> "Direct Debit"
      )
      case _: PayPalReferenceTransaction => List("payment method" -> "PayPal")
      case _: CreditCardReferenceTransaction => List("payment method" -> "credit / debit card")
    }
  }
}
