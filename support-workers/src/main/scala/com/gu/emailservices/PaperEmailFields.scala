package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{FulfilmentOptions, HomeDelivery, ProductOptions}
import com.gu.support.promotions.Promotion
import com.gu.support.workers._
import com.gu.support.workers.states.PaymentMethodWithSchedule
import org.joda.time.LocalDate

case class PaperEmailFields(
  fulfilmentOptions: FulfilmentOptions,
  productOptions: ProductOptions,
  firstDeliveryDate: Option[LocalDate],
  paymentMethodWithSchedule: PaymentMethodWithSchedule,
  giftRecipient: Option[GiftRecipient] = None
) extends SubscriptionEmailFields {

  override def apply(
    subscriptionNumber: String,
    promotion: Option[Promotion] = None
  ): AllProductsEmailFields = new AllProductsEmailFields {

    def apply(
      billingPeriod: BillingPeriod,
      user: User,
      currency: Currency,
      sfContactId: SfContactId,
      directDebitMandateId: Option[String],
    ): EmailFields = new EmailFields {

      val additionalFields = List("package" -> productOptions.toString)

      val dataExtension: String = fulfilmentOptions match {
        case HomeDelivery => "paper-delivery"
        case _ => "paper-voucher"
      }

      override val fields: List[(String, String)] = PaperFieldsGenerator.fieldsFor(
        subscriptionNumber,
        billingPeriod,
        user,
        firstDeliveryDate,
        currency,
        paymentMethodWithSchedule,
        directDebitMandateId,
        promotion,
        giftRecipient
      ) ++ additionalFields

      override def payload: String = super.payload(user.primaryEmailAddress, dataExtension)

      override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
    }
  }
}
