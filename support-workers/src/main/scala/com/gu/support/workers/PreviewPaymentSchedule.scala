package com.gu.support.workers

import com.gu.support.zuora.api.response.{Charge, PreviewSubscribeResponse}
import com.gu.support.zuora.api.{PreviewSubscribeRequest, SubscribeItem}
import com.gu.zuora.ZuoraSubscribeService
import org.joda.time.LocalDate

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

object PreviewPaymentSchedule {

  def preview(
      subscribeItem: SubscribeItem,
      billingPeriod: BillingPeriod,
      zuoraService: ZuoraSubscribeService,
      singleResponseCheck: Future[List[PreviewSubscribeResponse]] => Future[PreviewSubscribeResponse],
  ): Future[PaymentSchedule] = {
    val numberOfInvoicesToPreview: Int = billingPeriod match {
      case Monthly => 13
      case Quarterly => 5
      case com.gu.support.workers.Annual => 2
      case SixWeekly => 2
    }
    singleResponseCheck(
      zuoraService.previewSubscribe(PreviewSubscribeRequest.fromSubscribe(subscribeItem, numberOfInvoicesToPreview)),
    ).map(response => paymentSchedule(response.invoiceData.flatMap(_.invoiceItem)))
  }

  def round(d: Double) = BigDecimal(d).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble

  def paymentSchedule(charges: List[Charge]): PaymentSchedule = {
    val dateChargeMap = charges.groupBy(_.serviceStartDate)
    val payments = dateChargeMap.map { dateAndCharge =>
      val (paymentDate, charges) = dateAndCharge
      Payment(paymentDate, round(charges.map(charge => charge.chargeAmount + charge.taxAmount).sum))
    }
    implicit def localDateOrdering: Ordering[LocalDate] = Ordering.fromLessThan(_ isBefore _)
    PaymentSchedule(payments.toList.sortBy(_.date))
  }

}
