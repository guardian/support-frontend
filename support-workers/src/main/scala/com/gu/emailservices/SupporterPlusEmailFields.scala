package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.{formatDate, hyphenate, mask}
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailSupporterPlusState
import org.joda.time.DateTime

import scala.concurrent.{ExecutionContext, Future}

class SupporterPlusEmailFields(
    paperFieldsGenerator: PaperFieldsGenerator,
    getMandate: String => Future[Option[String]],
    touchPointEnvironment: TouchPointEnvironment,
    created: DateTime,
) {

  def build(
      state: SendThankYouEmailSupporterPlusState,
  )(implicit ec: ExecutionContext): Future[EmailFields] =
    getPaymentFields(
      state.paymentMethod,
      state.accountNumber,
      created,
    ).map { paymentFields =>
      val promotion = paperFieldsGenerator.getAppliedPromotion(
        state.promoCode,
        state.user.billingAddress.country,
        ProductTypeRatePlans.supporterPlusRatePlan(state.product, touchPointEnvironment).map(_.id).getOrElse(""),
      )
      val subscription_details = SubscriptionEmailFieldHelpers
        .describe(state.paymentSchedule, state.product.billingPeriod, state.product.currency)
      val fields = List(
        "email_address" -> state.user.primaryEmailAddress,
        "created" -> created.toString,
        "currency" -> state.product.currency.iso,
        "first_name" -> state.user.firstName,
        "last_name" -> state.user.lastName,
        "billing_period" -> state.product.billingPeriod.toString.toLowerCase,
        "product" -> s"${state.product.billingPeriod.toString.toLowerCase}-supporter-plus",
        "zuorasubscriberid" -> state.subscriptionNumber,
        "subscription_details" -> subscription_details,
      ) ++ paymentFields

      EmailFields(fields, state.user, "supporter-plus")
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
      case _: PayPalReferenceTransaction =>
        Future.successful(List("payment method" -> "PayPal", "first payment date" -> formatDate(created.toLocalDate)))
      case _: CreditCardReferenceTransaction =>
        Future.successful(
          List("payment method" -> "credit / debit card", "first payment date" -> formatDate(created.toLocalDate)),
        )
      case _: AmazonPayPaymentMethod =>
        Future.successful(
          List("payment method" -> "AmazonPay", "first payment date" -> formatDate(created.toLocalDate)),
        )
    }
  }
}
