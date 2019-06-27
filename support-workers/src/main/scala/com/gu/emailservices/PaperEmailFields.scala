package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{FulfilmentOptions, HomeDelivery, ProductOptions}
import com.gu.support.promotions.Promotion
import com.gu.support.workers._
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
  paymentMethod: PaymentMethod,
  sfContactId: SfContactId,
  directDebitMandateId: Option[String] = None,
  promotion: Option[Promotion] = None
) extends EmailFields {

  val additionalFields = List("package" -> productOptions.toString)

  val dataExtension = fulfilmentOptions match {
    case HomeDelivery => "paper-delivery"
    case _ => "paper-voucher"
  }

  override val fields = PaperFieldsGenerator.fieldsFor(
    subscriptionNumber, billingPeriod, user, paymentSchedule, firstDeliveryDate, currency, paymentMethod, sfContactId, directDebitMandateId
  ) ++ additionalFields

  override def payload: String = super.payload(user.primaryEmailAddress, dataExtension)
  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}
