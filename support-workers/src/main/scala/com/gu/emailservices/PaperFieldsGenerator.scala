package com.gu.emailservices

import com.gu.support.workers._
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

class PaperFieldsGenerator(
    getMandate: String => Future[Option[String]],
) {

  def fieldsFor(
      paymentMethod: PaymentMethod,
      paymentSchedule: PaymentSchedule,
      accountNumber: String,
      subscriptionNumber: String,
      product: ProductType,
      user: User,
      fixedTerm: Boolean,
      firstDeliveryDate: LocalDate,
  )(implicit ec: ExecutionContext): Future[List[(String, String)]] = {

    val firstPaymentDate = SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date
    val deliveryAddressFields = getAddressFields(user)
    val paymentDescription = SubscriptionEmailFieldHelpers.describe(
      paymentSchedule,
      product.billingPeriod,
      product.currency,
      fixedTerm,
    )

    val basicFields = List(
      "ZuoraSubscriberId" -> subscriptionNumber,
      "EmailAddress" -> user.primaryEmailAddress,
      "subscriber_id" -> subscriptionNumber,
      "first_name" -> user.firstName,
      "last_name" -> user.lastName,
      "date_of_first_paper" -> SubscriptionEmailFieldHelpers.formatDate(firstDeliveryDate),
      "date_of_first_payment" -> SubscriptionEmailFieldHelpers.formatDate(firstPaymentDate),
      "subscription_rate" -> paymentDescription,
    )

    for {
      paymentFields <- getPaymentFields(paymentMethod, accountNumber)
    } yield basicFields ++ paymentFields ++ deliveryAddressFields

  }

  protected def getAddressFields(user: User) = {
    val address = user.deliveryAddress.getOrElse(user.billingAddress)

    List(
      "delivery_address_line_1" -> address.lineOne.getOrElse(""),
      "delivery_address_line_2" -> address.lineTwo.getOrElse(""),
      "delivery_address_town" -> address.city.getOrElse(""),
      "delivery_postcode" -> address.postCode.getOrElse(""),
      "delivery_country" -> address.country.name,
    )
  }

  protected def getPaymentFields(
      paymentMethod: PaymentMethod,
      accountNumber: String,
  )(implicit ec: ExecutionContext): Future[Seq[(String, String)]] = paymentMethod match {
    case dd: DirectDebitPaymentMethod =>
      getMandate(accountNumber).map(directDebitMandateId =>
        List(
          "bank_account_no" -> SubscriptionEmailFieldHelpers.mask(dd.BankTransferAccountNumber),
          "bank_sort_code" -> SubscriptionEmailFieldHelpers.hyphenate(dd.BankCode),
          "account_holder" -> dd.BankTransferAccountName,
          "payment_method" -> "Direct Debit",
          "mandate_id" -> directDebitMandateId.getOrElse(""),
        ),
      )
    case dd: ClonedDirectDebitPaymentMethod =>
      Future.successful(
        List(
          "bank_account_no" -> SubscriptionEmailFieldHelpers.mask(dd.BankTransferAccountNumber),
          "bank_sort_code" -> SubscriptionEmailFieldHelpers.hyphenate(dd.BankCode),
          "account_holder" -> dd.BankTransferAccountName,
          "payment_method" -> "Direct Debit",
          "mandate_id" -> dd.MandateId,
        ),
      )
    case _: CreditCardReferenceTransaction => Future.successful(List("payment_method" -> "Credit/Debit Card"))
    case _: PayPalReferenceTransaction => Future.successful(List("payment_method" -> "PayPal"))
    case _: PayPalCompletePaymentsWithBAIDReferenceTransaction => Future.successful(List("payment_method" -> "PayPal"))
    case _: SepaPaymentMethod => Future.successful(List("payment_method" -> "Sepa"))
  }

}
