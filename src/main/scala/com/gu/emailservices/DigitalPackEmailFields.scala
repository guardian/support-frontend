package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.support.workers.model._
import org.joda.time.LocalDate

import scala.math.BigDecimal.decimal

//{
//  "To": {
//    "Address": "gow5hckeqzc86qqx4rc@gu.com",
//    "SubscriberKey": "gow5hckeqzc86qqx4rc@gu.com",
//    "ContactAttributes": {
//      "SubscriberAttributes": {
//        "ZuoraSubscriberId": "A-S00045678",
//        "Date of first payment": "3 August 2018",
//        "Address 2": "",
//        "Trial period": "14",
//        "First Name": "first_GOW5hckeqZC86QQx4Rc",
//        "Last Name": "last_GOW5hckeqZC86QQx4Rc",
//        "Country": "United Kingdom",
//        "SubscriberKey": "gow5hckeqzc86qqx4rc@gu.com",
//        "Default payment method": "Credit/Debit Card",
//        "Currency": "£",
//        "Post Code": "N1 9AG",
//        "Subscription term": "month",
//        "City": "London",
//        "Subscription details": "£11.99 every month",
//        "EmailAddress": "gow5hckeqzc86qqx4rc@gu.com",
//        "Payment amount": "11.99",
//        "Address 1": "Kings Place"
//      }
//    }
//  },
//  "DataExtensionName": "digipack"
//}

case class DigitalPackEmailFields(
    accountId: String,
    billingPeriod: BillingPeriod,
    user: User,
    currency: Currency,
    paymentMethod: PaymentMethod,
    directDebitMandateId: Option[String] = None
) extends EmailFields {

  val amount = 11.99F //TODO: Get the real price
  val subscriptionDetails = s"${currency.glyph}$amount every ${billingPeriod.noun}"
  val paymentFields = paymentMethod match {
    case dd: DirectDebitPaymentMethod => List(
      "Account number" -> mask(dd.bankTransferAccountNumber),
      "Sort Code" -> hyphenate(dd.bankCode),
      "Account Name" -> dd.bankTransferAccountName,
      "Default payment method" -> "Direct Debit",
      "MandateID" -> directDebitMandateId.getOrElse("")
    )
    case _: CreditCardReferenceTransaction => List("Default payment method" -> "Credit/Debit Card")
    case _ => Seq("Default payment method" -> "PayPal")
  }

  override val fields = List(
    "ZuoraSubscriberId" -> accountId,
    "SubscriberKey" -> user.primaryEmailAddress,
    "EmailAddress" -> user.primaryEmailAddress,
    "Subscription term" -> billingPeriod.noun,
    "Payment amount" -> formatPrice(amount),
    "First Name" -> user.firstName,
    "Last Name" -> user.lastName,
    "Address 1" -> "", //TODO: We don't have this
    "Address 2" -> "", //TODO: We don't have this
    "City" -> "", //TODO: We don't have this
    "Post Code" -> "", //TODO: We don't have this
    "Country" -> user.country.name,
    "Date of first payment" -> formatDate(LocalDate.now), //TODO: work this out using trial period
    "Currency" -> currency.glyph,
    "Trial period" -> "14", //TODO: depends on Promo code
    "Subscription details" -> subscriptionDetails
  ) ++ paymentFields //TODO: ++ promotionFields

  def formatDate(d: LocalDate) = s"${d.dayOfMonth.get} ${d.monthOfYear.getAsText} ${d.year.getAsString}"

  def formatPrice(price: Float): String = decimal(price).bigDecimal.stripTrailingZeros.toPlainString

  def payload = super.payload(user.primaryEmailAddress, "digipack")

}
