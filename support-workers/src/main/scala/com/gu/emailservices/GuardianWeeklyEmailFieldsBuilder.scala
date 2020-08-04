package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.formatDate
import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.FulfilmentOptions
import com.gu.support.promotions.Promotion
import com.gu.support.workers._
import com.gu.support.workers.states.PaymentMethodWithSchedule
import org.joda.time.LocalDate

import scala.collection.immutable

case class GuardianWeeklyEmailFieldsBuilder(
  fulfilmentOptions: FulfilmentOptions,
  firstDeliveryDate: Option[LocalDate],
  paymentMethodWithSchedule: PaymentMethodWithSchedule,
  giftRecipient: Option[GiftRecipient] = None
) extends SubscriptionEmailFieldsBuilder {

  override def buildWith(
    subscriptionNumber: String,
    promotion: Option[Promotion] = None
  ): AllProductsEmailFieldsBuilder = new AllProductsEmailFieldsBuilder {

    override def buildWith(
      billingPeriod: BillingPeriod,
      user: User,
      currency: Currency,
      sfContactId: SfContactId,
      directDebitMandateId: Option[String],
    ): EmailFields = {

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
}
