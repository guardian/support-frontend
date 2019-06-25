package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.formatDate
import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.FulfilmentOptions
import com.gu.support.workers.{BillingPeriod, PaymentMethod, PaymentSchedule, User}
import org.joda.time.LocalDate

case class GuardianWeeklyEmailFields(
  subscriptionNumber: String,
  fulfilmentOptions: FulfilmentOptions,
  billingPeriod: BillingPeriod,
  user: User,
  paymentSchedule: PaymentSchedule,
  firstDeliveryDate: Option[LocalDate],
  currency: Currency,
  paymentMethod: PaymentMethod,
  sfContactId: SfContactId,
  directDebitMandateId: Option[String] = None
) extends EmailFields {

  val additionalFields = List(
    paymentSchedule.payments.lift(1).map(payment => "date_of_second_payment" -> formatDate(payment.date))
  )

  override val fields = PaperFieldsGenerator.fieldsFor(
    subscriptionNumber, billingPeriod, user, paymentSchedule, firstDeliveryDate, currency, paymentMethod, sfContactId, directDebitMandateId
  ) ++ additionalFields.flatten

  override def payload: String = super.payload(user.primaryEmailAddress, "guardian-weekly")
  override def userId: Either[SfContactId, IdentityUserId] = Left(sfContactId)
}

