package com.gu.emailservices

import com.gu.support.catalog.{FulfilmentOptions, HomeDelivery, Paper, ProductOptions}
import com.gu.support.workers._
import com.gu.support.workers.states.PaymentMethodWithSchedule
import org.joda.time.LocalDate

object PaperEmailFields {

  def build(
    subscriptionEmailFields: SubscriptionEmailFields,
    fulfilmentOptions: FulfilmentOptions,
    productOptions: ProductOptions,
    firstDeliveryDate: Option[LocalDate],
    paymentMethodWithSchedule: PaymentMethodWithSchedule,
    giftRecipient: Option[GiftRecipient] = None
  ): EmailFields = {
    import subscriptionEmailFields._
    import allProductsEmailFields._

    val additionalFields = List("package" -> productOptions.toString)

    val dataExtension: String = fulfilmentOptions match {
      case HomeDelivery => "paper-delivery"
      case _ => if (Paper.useDigitalVoucher) "paper-subscription-card" else "paper-voucher"
    }

    val fields: List[(String, String)] = PaperFieldsGenerator.fieldsFor(
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

    EmailFields(fields, Left(sfContactId), user.primaryEmailAddress, dataExtension)
  }
}
