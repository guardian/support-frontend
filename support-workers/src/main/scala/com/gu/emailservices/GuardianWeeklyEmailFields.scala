package com.gu.emailservices

import com.gu.emailservices.SubscriptionEmailFieldHelpers.formatDate
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailGuardianWeeklyState
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}

import scala.collection.immutable
import scala.concurrent.{ExecutionContext, Future}

class GuardianWeeklyEmailFields(
    paperFieldsGenerator: PaperFieldsGenerator,
    touchPointEnvironment: TouchPointEnvironment,
) {
  def build(gw: SendThankYouEmailGuardianWeeklyState)(implicit ec: ExecutionContext): Future[EmailFields] = {

    val additionalFields: immutable.Seq[(String, String)] =
      gw.paymentSchedule.payments
        .lift(1)
        .map(payment => List("date_of_second_payment" -> formatDate(payment.date)))
        .getOrElse(Nil)

    val giftRecipientFields = gw.giftRecipient.toList.flatMap(recipient =>
      List(
        "giftee_first_name" -> recipient.firstName,
        "giftee_last_name" -> recipient.lastName,
      ),
    )

    paperFieldsGenerator
      .fieldsFor(
        gw.paymentMethod,
        gw.paymentSchedule,
        gw.promoCode,
        gw.accountNumber,
        gw.subscriptionNumber,
        gw.product,
        gw.user,
        ProductTypeRatePlans
          .weeklyRatePlan(gw.product, touchPointEnvironment, if (gw.giftRecipient.isDefined) Gift else Direct)
          .map(_.id),
        fixedTerm = gw.giftRecipient.isDefined,
        gw.firstDeliveryDate,
      )
      .map(fields =>
        EmailFields(
          fields ++ additionalFields ++ giftRecipientFields,
          gw.user,
          "guardian-weekly",
        ),
      )
  }

}
