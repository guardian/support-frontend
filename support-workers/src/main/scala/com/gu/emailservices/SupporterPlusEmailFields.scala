package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.{formatDate, hyphenate, mask}
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState.{
  SendThankYouEmailContributionState,
  SendThankYouEmailSupporterPlusState,
}
import org.joda.time.DateTime

import scala.concurrent.{ExecutionContext, Future}

class SupporterPlusEmailFields(
    getMandate: String => Future[Option[String]],
    created: DateTime,
) {

  def build(
      state: SendThankYouEmailSupporterPlusState,
  )(implicit ec: ExecutionContext): Future[EmailFields] = {
    getPaymentFields(
      state.paymentMethod,
      state.accountNumber,
      created,
    ).map { paymentFields =>
      val fields = List(
        "EmailAddress" -> state.user.primaryEmailAddress,
        "created" -> created.toString,
        "amount" -> state.product.amount.toString,
        "currency" -> state.product.currency.iso,
        "edition" -> state.user.billingAddress.country.alpha2,
        "name" -> state.user.firstName,
        "product" -> s"${state.product.billingPeriod.toString.toLowerCase}-supporter-plus",
      ) ++ paymentFields

      EmailFields(fields, state.user, "supporter-plus-thank-you") // TODO: this doesn't exist yet
    }
  }

  def getPaymentFields(paymentMethod: PaymentMethod, accountNumber: String, created: DateTime)(implicit
      ec: ExecutionContext,
  ): Future[Seq[(String, String)]] = {
    paymentMethod match {
      case dd: DirectDebitPaymentMethod =>
        getMandate(accountNumber).map(directDebitMandateId =>
          List(
            "account name" -> dd.BankTransferAccountName,
            "account number" -> mask(dd.BankTransferAccountNumber),
            "sort code" -> hyphenate(dd.BankCode),
            "Mandate ID" -> directDebitMandateId.getOrElse(""),
            "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
            "payment method" -> "Direct Debit",
          ),
        )
      case dd: ClonedDirectDebitPaymentMethod =>
        Future.successful(
          List(
            "account name" -> dd.BankTransferAccountName,
            "account number" -> mask(dd.BankTransferAccountNumber),
            "sort code" -> hyphenate(dd.BankCode),
            "Mandate ID" -> dd.MandateId,
            "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
            "payment method" -> "Direct Debit",
          ),
        )
      case sepa: SepaPaymentMethod =>
        Future.successful(
          List(
            "account name" -> sepa.BankTransferAccountName,
            "account number" -> mask(sepa.BankTransferAccountNumber),
            "first payment date" -> formatDate(created.plusDays(10).toLocalDate),
            "payment method" -> "SEPA",
          ),
        )
      case _: PayPalReferenceTransaction => Future.successful(List("payment method" -> "PayPal"))
      case _: CreditCardReferenceTransaction => Future.successful(List("payment method" -> "credit / debit card"))
      case _: AmazonPayPaymentMethod => Future.successful(List("payment method" -> "AmazonPay"))
    }
  }
}
