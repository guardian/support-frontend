package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.formatDate
import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.FulfilmentOptions
import com.gu.support.promotions.Promotion
import com.gu.support.workers._
import com.gu.support.workers.states.PaymentDetails
import org.joda.time.LocalDate

import scala.collection.immutable

case class GuardianWeeklyEmailFields(
  subscriptionNumber: String,
  fulfilmentOptions: FulfilmentOptions,
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

  val additionalFields: immutable.Seq[(String, String)] = paymentSchedule.payments.lift(1).map(
    payment => List("date_of_second_payment" -> formatDate(payment.date))
  ).getOrElse(Nil)

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

  override def payload: String = super.payload(user.primaryEmailAddress, "guardian-weekly")
  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}

