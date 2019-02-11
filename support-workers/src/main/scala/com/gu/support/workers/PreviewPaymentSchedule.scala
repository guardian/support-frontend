package com.gu.support.workers

import com.gu.services.Services
import com.gu.support.zuora.api.response.{Charge, PreviewSubscribeResponse}
import com.gu.support.zuora.api.{PreviewSubscribeRequest, SubscribeItem}
import org.joda.time.LocalDate

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

object PreviewPaymentSchedule {

  def apply(
    subscribeItem: SubscribeItem,
    billingPeriod: BillingPeriod,
    services: Services,
    singleResponseCheck: Future[List[PreviewSubscribeResponse]] => Future[PreviewSubscribeResponse]
  ): Future[PaymentSchedule] = {
    val numberOfInvoicesToPreview: Int = billingPeriod match {
      case Monthly => 13
      case Quarterly => 5
      case com.gu.support.workers.Annual => 2
      case SixWeekly => 2
    }
    singleResponseCheck(
      services.zuoraService.previewSubscribe(PreviewSubscribeRequest.fromSubscribe(subscribeItem, numberOfInvoicesToPreview))
    ).map(response => paymentSchedule(response.invoiceData.flatMap(_.invoiceItem)))
  }

  def paymentSchedule(charges: List[Charge]): PaymentSchedule = {
    val dateChargeMap = charges.groupBy(_.serviceStartDate)
    val payments = dateChargeMap.map { dateAndCharge =>
      val (paymentDate, charges) = dateAndCharge
      Payment(paymentDate, charges.map(charge => charge.chargeAmount + charge.taxAmount).sum)
    }
    implicit def localDateOrdering: Ordering[LocalDate] = Ordering.fromLessThan(_ isBefore _)
    PaymentSchedule(payments.toList.sortBy(_.date))
  }

}
