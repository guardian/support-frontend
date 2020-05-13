package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{FulfilmentOptions, HomeDelivery, ProductOptions}
import com.gu.support.promotions.Promotion
import com.gu.support.workers._
import com.gu.support.workers.states.PaymentDetails
import org.joda.time.LocalDate

case class PaperEmailFields(
  subscriptionNumber: String,
  fulfilmentOptions: FulfilmentOptions,
  productOptions: ProductOptions,
  billingPeriod: BillingPeriod,
  user: User,
  paymentSchedule: PaymentSchedule,
  firstDeliveryDate: Option[LocalDate],
  currency: Currency,
  paymentMethod: PaymentDetails[PaymentMethod],
  sfContactId: SfContactId,
  directDebitMandateId: Option[String] = None,
  promotion: Option[Promotion] = None,
  giftRecipient: Option[GiftRecipient] = None
) extends EmailFields {

  val additionalFields = List("package" -> productOptions.toString)

  val dataExtension: String = fulfilmentOptions match {
    case HomeDelivery => "paper-delivery"
    case _ => "paper-voucher"
  }

  override val fields: List[(String, String)] = PaperFieldsGenerator.fieldsFor(
    subscriptionNumber,
    billingPeriod,
    user,
    paymentSchedule,
    firstDeliveryDate,
    currency,
    paymentMethod,
    sfContactId,
    directDebitMandateId,
    promotion,
    giftRecipient
  ) ++ additionalFields

  override def payload: String = super.payload(user.primaryEmailAddress, dataExtension)

  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}
