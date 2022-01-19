package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.support.promotions.{IntroductoryPriceBenefit, Issue, Promotion}
import com.gu.support.workers._
import org.joda.time.format.DateTimeFormat
import org.joda.time.{LocalDate, Months}

import java.text.DecimalFormat
import scala.util.Try

object SubscriptionEmailFieldHelpers {

  implicit def localDateOrdering: Ordering[LocalDate] = Ordering.fromLessThan(_ isBefore _)

  val formatter = new DecimalFormat("#.00")

  def formatPrice(price: Double): String = formatter.format(price)

  def priceWithCurrency(currency: Currency, amount: Double): String = s"${currency.glyph}${formatter.format(amount)}"

  def firstPayment(paymentSchedule: PaymentSchedule): Payment = paymentSchedule.payments.minBy(_.date)

  def pluralise(num: Int, thing: String): String = if(num > 1) s"$num ${thing}s" else s"$num $thing"

  def introductoryPeriod(introductoryBillingPeriods: Int, billingPeriod: BillingPeriod): String =
    s"${pluralise(introductoryBillingPeriods, billingPeriod.noun)}"


  def describe(
    paymentSchedule: PaymentSchedule,
    billingPeriod: BillingPeriod,
    currency: Currency,
    promotion: Option[Promotion],
    fixedTerm: Boolean = false
  ): String = {
    promotion.flatMap(_.introductoryPrice)
      .map(introductoryPrice => introductoryPriceDescription(paymentSchedule, billingPeriod, currency, introductoryPrice))
      .getOrElse(standardDescription(paymentSchedule, billingPeriod, currency, fixedTerm))
  }

  def introductoryPriceDescription(
    paymentSchedule: PaymentSchedule,
    billingPeriod: BillingPeriod,
    currency: Currency,
    benefit: IntroductoryPriceBenefit
  ): String =
    Try(paymentSchedule.payments.tail.head).fold(
      _ => "",
      payment => s"${priceWithCurrency(currency, benefit.price)} for ${pluralise(benefit.periodLength, benefit.periodType.toString.toLowerCase)}, " +
        s"then ${priceWithCurrency(currency, payment.amount)} every ${billingPeriod.noun}"
    )

  def giftNoun(billingPeriod: BillingPeriod): String = billingPeriod match {
    case Quarterly => "3 months"
    case Annual => "12 months"
    case _ => billingPeriod.noun
  }

  def standardDescription(paymentSchedule: PaymentSchedule, billingPeriod: BillingPeriod, currency: Currency, fixedTerm: Boolean): String = {
    val initialPrice = firstPayment(paymentSchedule).amount
    val (paymentsWithInitialPrice, paymentsWithDifferentPrice) = paymentSchedule.payments.partition(_.amount == initialPrice)

    if (fixedTerm){
      s"${priceWithCurrency(currency, initialPrice)} for ${giftNoun(billingPeriod)}"
    }
    else if (paymentSchedule.payments.size == 1) {
      s"${priceWithCurrency(currency, initialPrice)} for the first ${billingPeriod.noun}"
    }
    else if (paymentsWithDifferentPrice.isEmpty) {
      s"${priceWithCurrency(currency, initialPrice)} every ${billingPeriod.noun}"
    } else {
      val introductoryTimespan = {
        val firstIntroductoryPayment = paymentsWithInitialPrice.minBy(_.date)
        val firstDifferentPayment = paymentsWithDifferentPrice.minBy(_.date)
        val monthsAtIntroductoryPrice = Months.monthsBetween(firstIntroductoryPayment.date, firstDifferentPayment.date).getMonths
        billingPeriod match {
          case Annual => introductoryPeriod(monthsAtIntroductoryPrice / 12, billingPeriod)
          case Quarterly => introductoryPeriod(monthsAtIntroductoryPrice / 3, billingPeriod)
          case Monthly => introductoryPeriod(monthsAtIntroductoryPrice, billingPeriod)
          case SixWeekly => throw new RuntimeException("Six for six is currently unsupported")
        }
      }
      s"${priceWithCurrency(currency, initialPrice)} every ${billingPeriod.noun} for $introductoryTimespan, " +
        s"then ${priceWithCurrency(currency, paymentsWithDifferentPrice.head.amount)} every ${billingPeriod.noun}"
    }

  }

  def formatDate(d: LocalDate): String = DateTimeFormat.forPattern("EEEE, d MMMM yyyy").print(d)

  def mask(s: String): String = s.replace(s.substring(0, 6), "******")

  def hyphenate(s: String): String = s"${s.substring(0, 2)}-${s.substring(2, 4)}-${s.substring(4, 6)}"
}
