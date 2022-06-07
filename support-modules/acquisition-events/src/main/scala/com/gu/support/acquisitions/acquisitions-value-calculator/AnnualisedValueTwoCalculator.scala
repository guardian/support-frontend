package com.gu.acquisitionsValueCalculator

import cats.syntax.either._
import com.gu.support.acquisitions.models._
import com.gu.support.acquisitions.models.PaymentFrequency._
import com.gu.support.acquisitions.models.PrintProduct._
import com.gu.support.acquisitions.models.AcquisitionProduct

object AnnualisedValueTwoCalculator {

  //Currencies - All other currencies are treated as ROW
  val GBP = "GBP"
  val USD = "USD"
  val AUD = "AUD"

  //Country codes - All other countries are treated as ROW
  val GB = "GB"
  val US = "US"
  val AU = "AU"

  def getPaymentFrequencyMultiplyer(paymentFrequency: PaymentFrequency): Either[String, Double] =
    paymentFrequency match {
      case OneOff => Right(1)
      case Annually => Right(1)
      case SixMonthly => Right(2)
      case Quarterly => Right(4)
      case Monthly => Right(12)
      case _ => Left("Unknown payment frequency")
    }

  def getContributionMargin(a: AcquisitionModel): Either[String, Double] =
    (a.paymentFrequency, a.currency) match {
      case (OneOff, _) => Right(0.99)
      case (_, _) => Left("Payment Frequency for one-off contribution must be ONE_OFF")
    }

  def getRecurringMargin(a: AcquisitionModel): Either[String, Double] =
    (a.paymentFrequency, a.currency) match {
      case (Monthly, GBP) => Right(0.8858596)
      case (Monthly, USD) => Right(0.8348365)
      case (Monthly, AUD) => Right(0.8954700)
      case (Monthly, _) => Right(0.8586346)
      case (Annually, _) => Right(0.99)
      case (_, _) => Left("Payment Frequency for recurring contributions must be MONTHLY")
    }

  def getMembershipSupporterAV(a: AcquisitionModel): Either[String, Double] =
    (a.paymentFrequency, a.currency) match {
      case (Monthly, GBP) => Right(44.20)
      case (Monthly, USD) => Right(70.03)
      case (Monthly, AUD) => Right(107.9277)
      case (Monthly, _) => Right(42.85)
      case (Annually, GBP) => Right(40.26575)
      case (Annually, USD) => Right(68.18)
      case (Annually, AUD) => Right(98.1855)
      case (Annually, _) => Right(40.28)
      case (_) => Left("Error calculating AV for membership supporter")
    }

  def getMembershipPartnerAV(a: AcquisitionModel): Either[String, Double] =
    (a.paymentFrequency, a.currency) match {
      case (Monthly, GBP) => Right(103.98)
      case (Annually, GBP) => Right(90.50)
      case (Annually | Monthly, _) =>
        Left("Cannot calculate AV for partner in any currency other than GBP")
      case _ => Left("Error calculating AV for membership partner")
    }

  def getMembershipPatronAV(a: AcquisitionModel): Either[String, Double] =
    (a.paymentFrequency, a.currency) match {
      case (Monthly, GBP) => Right(501.81)
      case (Annually, GBP) => Right(460.29)
      case (Annually | Monthly, _) =>
        Left("Cannot calculate AV for patron in any currency other than GBP")
      case _ => Left("Error calculating AV for membership partner")
    }

  def getDigitalSubscriptionAV(a: AcquisitionModel): Either[String, Double] =
    a.currency match {
      case GBP => Right(86.86)
      case USD => Right(179.07)
      case AUD => Right(164.6232)
      case _ => Right(74.63)
    }

  def getPrintAV(a: AcquisitionModel): Either[String, Double] =
    a.printOptions.map(x => {
      (x.product, x.deliveryCountryCode) match {
        case (GuardianWeekly, GB) => Right(67.73)
        case (GuardianWeekly, US) => Right(105.19)
        case (GuardianWeekly, AU) => Right(209.50)
        case (GuardianWeekly, _) => Right(68.58)
        case (VoucherSaturday, _) => Right(29.66)
        case (VoucherSaturdayPlus, _) => Right(88.07)
        case (VoucherSunday, _) => Right(36.09)
        case (VoucherSundayPlus, _) => Right(121.35)
        case (VoucherWeekend, _) => Right(68.42)
        case (VoucherWeekendPlus, _) => Right(131.41)
        case (VoucherSixday, _) => Right(157.84)
        case (VoucherSixdayPlus, _) => Right(202.31)
        case (VoucherEveryday, _) => Right(157.64)
        case (VoucherEverydayPlus, _) => Right(183.47)
        case (HomeDeliverySaturday, _) => Right(86.76)
        case (HomeDeliverySaturdayPlus, _) => Right(149.00)
        case (HomeDeliverySunday, _) => Right(85.15)
        case (HomeDeliverySundayPlus, _) => Right(176.96)
        case (HomeDeliveryWeekend, _) => Right(129.01)
        case (HomeDeliveryWeekendPlus, _) => Right(196.70)
        case (HomeDeliverySixday, _) => Right(298.53)
        case (HomeDeliverySixdayPlus, _) => Right(345.54)
        case (HomeDeliveryEveryday, _) => Right(320.04)
        case (HomeDeliveryEverydayPlus, _) => Right(346.65)
        case _ => Left(s"No pricing information for ${x.product.value}")
      }
    }).getOrElse(Left("No print options supplied"))

  def getMargin(a: AcquisitionModel) =
    a.product match {
      case AcquisitionProduct.Contribution => getContributionMargin(a)
      case AcquisitionProduct.RecurringContribution => getRecurringMargin(a)
      case _ => Left("Business logic not yet implemented for product")
    }

  def getContributionAV(a: AcquisitionModel): Either[String, Double] =
    for {
      margin <- getMargin(a)
      paymentFrequencyMultiplier <- getPaymentFrequencyMultiplyer(a.paymentFrequency)
    } yield {
      a.amount * margin * paymentFrequencyMultiplier
    }

  def getAnnualisedValue(a: AcquisitionModel): Either[String, Double] =
    a.product match {
      case AcquisitionProduct.Contribution => getContributionAV(a)
      case AcquisitionProduct.RecurringContribution => getContributionAV(a)
      case AcquisitionProduct.DigitalSubscription => getDigitalSubscriptionAV(a)
      case AcquisitionProduct.GuardianWeekly => getPrintAV(a)
      case AcquisitionProduct.Paper => getPrintAV(a)
      case AcquisitionProduct.AppPremiumTier => Left("App premium tier not implemented yet")
      case _ => Left("Business logic not yet implemented for product")
    }

}
