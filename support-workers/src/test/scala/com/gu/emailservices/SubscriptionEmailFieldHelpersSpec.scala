package com.gu.emailservices

import com.gu.i18n.Currency.{EUR, GBP, USD}
import com.gu.support.promotions.Promotions.SixForSixPromotion
import com.gu.support.workers._
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SubscriptionEmailFieldHelpersSpec extends AnyFlatSpec with Matchers {

  def payments(original: Payment, subsequentMonths: List[Int]): List[Payment] = {
    val subsequentPayments = subsequentMonths.map { monthNumber =>
      original.copy(date = original.date.plusMonths(monthNumber))
    }
    List(original) ++ subsequentPayments
  }

  val referenceDate = new LocalDate(2019, 1, 14)

  "describe" should "explain a simple annual payment schedule correctly" in {
    val standardDigitalPackPayment = Payment(referenceDate, 119.90)
    val schedule = payments(standardDigitalPackPayment, List(12))
    val expected = "£119.90 every year"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Annual, GBP, None) == expected)
  }

  "describe" should "explain a simple quarterly payment schedule correctly" in {
    val standardDigitalPackPayment = Payment(referenceDate, 57.50)
    val schedule = payments(standardDigitalPackPayment, List(3, 6, 9))
    val expected = "$57.50 every quarter"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Quarterly, USD, None) == expected)
  }

  "describe" should "explain a simple monthly payment schedule correctly" in {
    val standardDigitalPackPayment = Payment(referenceDate, 11.99)
    val schedule = payments(standardDigitalPackPayment, List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12))
    val expected = "€11.99 every month"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Monthly, EUR, None) == expected)
  }

  "describe" should "explain a payment schedule truthfully if we only get information about the first payment" in {
    val discountedDigitalPackPayment = Payment(referenceDate, 100.90)
    val schedule = PaymentSchedule(List(discountedDigitalPackPayment))
    val expected = "£100.90 for the first year"
    assert(SubscriptionEmailFieldHelpers.describe(schedule, Annual, GBP, None) == expected)
  }

  "describe" should "explain a payment schedule correctly if the first 3 months are discounted" in {
    val firstDiscountedPayment = Payment(referenceDate, 5.99)
    val firstFullPricePayment = Payment(referenceDate.plusMonths(3), 11.99)
    val schedule: List[Payment] =
      payments(firstDiscountedPayment, List(1, 2)) ++ payments(firstFullPricePayment, List(1, 2, 3, 4, 5, 6, 7, 8, 9))
    val expected = "£5.99 every month for 3 months, then £11.99 every month"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Monthly, GBP, None) == expected)
  }

  "describe" should "explain a payment schedule correctly if the first 2 quarters are discounted" in {
    val firstDiscountedPayment = Payment(referenceDate, 30.00)
    val firstFullPricePayment = Payment(referenceDate.plusMonths(6), 37.50)
    val schedule: List[Payment] =
      payments(firstDiscountedPayment, List(3)) ++ payments(firstFullPricePayment, List(3, 6))
    val expected = "£30.00 every quarter for 2 quarters, then £37.50 every quarter"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Quarterly, GBP, None) == expected)
  }

  "describe" should "explain a 6 for 6 subscription correctly" in {
    val firstPayment = Payment(referenceDate, 6)
    val fullPricePayment = Payment(referenceDate.plusWeeks(6), 37.50)
    val schedule: List[Payment] =
      List(firstPayment, fullPricePayment, fullPricePayment.copy(fullPricePayment.date.plusMonths(3)))
    val expected = "£6.00 for 6 issues, then £37.50 every quarter"
    assert(
      SubscriptionEmailFieldHelpers.describe(
        PaymentSchedule(schedule),
        Quarterly,
        GBP,
        Some(SixForSixPromotion),
      ) == expected,
    )
  }

}
