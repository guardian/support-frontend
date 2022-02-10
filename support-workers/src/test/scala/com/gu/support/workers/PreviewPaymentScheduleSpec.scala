package com.gu.support.workers

import com.gu.support.zuora.api.response.{Charge, PreviewSubscribeResponse}
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.parser._
import JsonFixtures.previewSubscribeResponseJson

class PreviewPaymentScheduleSpec extends AnyFlatSpec with Matchers {

  val firstPaymentDate = new LocalDate(2019, 1, 14)

  "paymentSchedule" should "calculate a payment schedule correctly for products without tax" in {
    val taxExclusiveCharge = Charge(firstPaymentDate, firstPaymentDate.plusMonths(1), 0, 5.00)
    val charges = List(
      taxExclusiveCharge,
      taxExclusiveCharge.copy(
        serviceStartDate = firstPaymentDate.plusMonths(1),
        serviceEndDate = firstPaymentDate.plusMonths(2),
      ),
    )
    val expected = PaymentSchedule(List(Payment(firstPaymentDate, 5.00), Payment(firstPaymentDate.plusMonths(1), 5.00)))
    val schedule = PreviewPaymentSchedule.paymentSchedule(charges)
    assert(schedule == expected)
  }

  it should "calculate a payment schedule correctly for products with tax" in {
    val charges = List(
      Charge(firstPaymentDate, firstPaymentDate.plusMonths(1), 1.25, 4.00),
      Charge(firstPaymentDate.plusMonths(1), firstPaymentDate.plusMonths(2), 1.50, 5.00),
    )
    val expected = PaymentSchedule(List(Payment(firstPaymentDate, 5.25), Payment(firstPaymentDate.plusMonths(1), 6.50)))
    val schedule = PreviewPaymentSchedule.paymentSchedule(charges)
    assert(schedule == expected)
  }

  it should "round Payment amounts to two decimal places" in {
    val previewSubscribeResponse = decode[PreviewSubscribeResponse](previewSubscribeResponseJson).toOption.get

    val charges = previewSubscribeResponse.invoiceData.flatMap(_.invoiceItem)

    val schedule = PreviewPaymentSchedule.paymentSchedule(charges)

    schedule.payments.length shouldBe 13
    schedule.payments.forall(p => p.amount == 52.99) shouldBe true
  }

}
