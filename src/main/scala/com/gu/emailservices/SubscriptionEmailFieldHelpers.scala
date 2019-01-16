package com.gu.emailservices

import java.text.DecimalFormat
import com.gu.i18n.Currency
import com.gu.support.workers._
import org.joda.time.{LocalDate, Months}

object SubscriptionEmailFieldHelpers {

  implicit def localDateOrdering: Ordering[LocalDate] = Ordering.fromLessThan(_ isBefore _)

  val formatter = new DecimalFormat("#.00")

  def formatPrice(price: Double): String = formatter.format(price)

  def priceWithCurrency(currency: Currency, amount: Double): String = s"${currency.glyph}${formatter.format(amount)}"

  def firstPayment(paymentSchedule: PaymentSchedule): Payment = paymentSchedule.payments.minBy(_.date)

  def describe(paymentSchedule: PaymentSchedule, billingPeriod: BillingPeriod, currency: Currency): String = {
    val initialPrice = firstPayment(paymentSchedule).amount
    val (paymentsWithInitialPrice, paymentsWithDifferentPrice) = paymentSchedule.payments.partition(_.amount == initialPrice)
    if (paymentsWithDifferentPrice.isEmpty) {
      s"${priceWithCurrency(currency, initialPrice)} every ${billingPeriod.noun}"
    } else {
      val introductoryTimespan = {
        val firstIntroductoryPayment = paymentsWithInitialPrice.minBy(_.date)
        val firstDifferentPayment = paymentsWithDifferentPrice.minBy(_.date)
        val monthsAtIntroductoryPrice = Months.monthsBetween(firstIntroductoryPayment.date, firstDifferentPayment.date).getMonths
        val introductoryBillingPeriods = billingPeriod match {
          case Annual => monthsAtIntroductoryPrice / 12
          case Quarterly => monthsAtIntroductoryPrice / 3
          case Monthly => monthsAtIntroductoryPrice
        }
        val pluraliseIfRequired = if (introductoryBillingPeriods > 1) "s" else ""
        s"$introductoryBillingPeriods ${billingPeriod.noun}$pluraliseIfRequired"
      }
      s"${priceWithCurrency(currency, initialPrice)} for $introductoryTimespan, " +
        s"then ${priceWithCurrency(currency, paymentsWithDifferentPrice.head.amount)} every ${billingPeriod.noun}"
    }
  }

}
