package com.gu.emailservices

import com.gu.i18n.Currency.{EUR, GBP, USD}
import com.gu.support.workers.{Annual, Monthly, Payment, PaymentSchedule, Quarterly}
import org.joda.time.LocalDate
import org.scalatest.{FlatSpec, Matchers}

class SubscriptionEmailFieldHelpersSpec extends FlatSpec with Matchers {

  def payments(original: Payment, subsequentMonths: List[Int]): List[Payment] = {
    val subsequentPayments = subsequentMonths.map {
      monthNumber => original.copy(date = original.date.plusMonths(monthNumber))
    }
    List(original) ++ subsequentPayments
  }

  val referenceDate = new LocalDate(2019, 1, 14)

  "describe" should "explain a simple annual payment schedule correctly" in {
    val standardDigitalPackPayment = Payment(referenceDate, 119.90)
    val schedule = payments(standardDigitalPackPayment, List(12))
    val expected = "£119.90 every year"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Annual, GBP) == expected)
  }

  "describe" should "explain a simple quarterly payment schedule correctly" in {
    val standardDigitalPackPayment = Payment(referenceDate, 57.50)
    val schedule = payments(standardDigitalPackPayment, List(3, 6, 9))
    val expected = "$57.50 every quarter"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Quarterly, USD) == expected)
  }

  "describe" should "explain a simple monthly payment schedule correctly" in {
    val standardDigitalPackPayment = Payment(referenceDate, 11.99)
    val schedule = payments(standardDigitalPackPayment, List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12))
    val expected = "€11.99 every month"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Monthly, EUR) == expected)
  }

  "describe" should "explain a payment schedule correctly if the first year is discounted" in {
    val discountedDigitalPackPayment = Payment(referenceDate, 100.90)
    val standardDigitalPackPayment = Payment(referenceDate.plusYears(1), 119.90)
    val schedule = PaymentSchedule(List(discountedDigitalPackPayment, standardDigitalPackPayment))
    val expected = "£100.90 for 1 year, then £119.90 every year"
    assert(SubscriptionEmailFieldHelpers.describe(schedule, Annual, GBP) == expected)
  }

  "describe" should "explain a payment schedule correctly if the first 3 months are discounted" in {
    val firstDiscountedPayment = Payment(referenceDate, 5.99)
    val firstFullPricePayment = Payment(referenceDate.plusMonths(3), 11.99)
    val schedule: List[Payment] = payments(firstDiscountedPayment, List(1, 2)) ++ payments(firstFullPricePayment, List(1, 2, 3, 4, 5, 6, 7, 8, 9))
    val expected = "£5.99 for 3 months, then £11.99 every month"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Monthly, GBP) == expected)
  }

  "describe" should "explain a payment schedule correctly if the first 2 quarters are discounted" in {
    val firstDiscountedPayment = Payment(referenceDate, 30.00)
    val firstFullPricePayment = Payment(referenceDate.plusMonths(6), 37.50)
    val schedule: List[Payment] = payments(firstDiscountedPayment, List(3)) ++ payments(firstFullPricePayment, List(3, 6))
    val expected = "£30.00 for 2 quarters, then £37.50 every quarter"
    assert(SubscriptionEmailFieldHelpers.describe(PaymentSchedule(schedule), Quarterly, GBP) == expected)
  }

}
