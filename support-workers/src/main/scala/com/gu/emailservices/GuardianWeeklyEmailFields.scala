package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.formatDate
import com.gu.support.catalog.FulfilmentOptions
import com.gu.support.workers._
import com.gu.support.workers.states.PaymentMethodWithSchedule
import org.joda.time.LocalDate

import scala.collection.immutable

object GuardianWeeklyEmailFields {
  def build(
    subscriptionEmailFields: SubscriptionEmailFields,
    firstDeliveryDate: Option[LocalDate],
    paymentMethodWithSchedule: PaymentMethodWithSchedule,
    giftRecipient: Option[GiftRecipient] = None
  ): EmailFields = {
    import subscriptionEmailFields._
    import allProductsEmailFields._

    val additionalFields: immutable.Seq[(String, String)] = paymentMethodWithSchedule.paymentSchedule.payments.lift(1).map(
      payment => List("date_of_second_payment" -> formatDate(payment.date))
    ).getOrElse(Nil)

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

    EmailFields(fields, Left(sfContactId), user.primaryEmailAddress, "guardian-weekly")
  }

}
