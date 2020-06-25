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

case class GuardianWeeklyEmailFields(
  fulfilmentOptions: FulfilmentOptions,
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

      val additionalFields: immutable.Seq[(String, String)] = paymentMethodWithSchedule.paymentSchedule.payments.lift(1).map(
        payment => List("date_of_second_payment" -> formatDate(payment.date))
      ).getOrElse(Nil)

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

      override def payload: String = super.payload(user.primaryEmailAddress, "guardian-weekly")

      override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
    }

  }
}
