package com.gu.support.acquisitions.models

import com.gu.i18n.{Country, Currency}
import com.gu.support.acquisitions.{AbTest, QueryParameter}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.zuora.api.ReaderType
import io.circe.{Decoder, Encoder}
import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat

import scala.util.{Failure, Success, Try}

case class AcquisitionDataRow(
    eventTimeStamp: DateTime,
    product: AcquisitionProduct,
    amount: Option[BigDecimal],
    country: Country,
    currency: Currency,
    componentId: Option[String],
    componentType: Option[String],
    campaignCode: Option[String],
    source: Option[String],
    referrerUrl: Option[String],
    abTests: List[AbTest],
    paymentFrequency: PaymentFrequency,
    paymentProvider: Option[PaymentProvider],
    printOptions: Option[PrintOptions],
    browserId: Option[String],
    identityId: Option[String],
    pageViewId: Option[String],
    referrerPageViewId: Option[String],
    labels: List[String],
    promoCode: Option[String],
    reusedExistingPaymentMethod: Boolean,
    readerType: ReaderType,
    acquisitionType: AcquisitionType,
    zuoraSubscriptionNumber: Option[String],
    zuoraAccountNumber: Option[String],
    contributionId: Option[String],
    paymentId: Option[String],
    queryParameters: List[QueryParameter],
    platform: Option[String],
)

object AcquisitionDataRow {
  implicit val decodeDateTime: Decoder[DateTime] = Decoder.decodeString.emap { s =>
    Try(DateTime.parse(s)) match {
      case Success(dt) => Right(dt)
      case Failure(e) => Left(e.getMessage)
    }
  }
  implicit val encodeDateTime: Encoder[DateTime] =
    Encoder.encodeString.contramap[DateTime](dt => ISODateTimeFormat.dateTime().print(dt))

  implicit val codec = deriveCodec[AcquisitionDataRow]
}

case class PrintOptions(
    product: PrintProduct,
    deliveryCountry: Country,
)

object PrintOptions {
  implicit val codec: Codec[PrintOptions] = deriveCodec
}

sealed abstract class PaymentFrequency(val value: String)

object PaymentFrequency {
  case object OneOff extends PaymentFrequency("ONE_OFF")

  case object Monthly extends PaymentFrequency("MONTHLY")

  case object Quarterly extends PaymentFrequency("QUARTERLY")

  case object SixMonthly extends PaymentFrequency("SIX_MONTHLY")

  case object Annually extends PaymentFrequency("ANNUALLY")

  def fromString(code: String): Option[PaymentFrequency] = {
    List(OneOff, Monthly, Annually, Quarterly, SixMonthly).find(_.value == code)
  }

  implicit val decoder: Decoder[PaymentFrequency] =
    Decoder.decodeString.emap(code => PaymentFrequency.fromString(code).toRight(s"unrecognised billing period '$code'"))

  implicit val encoder: Encoder[PaymentFrequency] = Encoder.encodeString.contramap[PaymentFrequency](_.value)
}

sealed abstract class AcquisitionProduct(val value: String)

object AcquisitionProduct {

  case object Contribution extends AcquisitionProduct("CONTRIBUTION")

  case object RecurringContribution extends AcquisitionProduct("RECURRING_CONTRIBUTION")

  case object SupporterPlus extends AcquisitionProduct("SUPPORTER_PLUS")

  case object DigitalSubscription extends AcquisitionProduct("DIGITAL_SUBSCRIPTION")

  case object Paper extends AcquisitionProduct("PRINT_SUBSCRIPTION")

  case object GuardianWeekly extends AcquisitionProduct("PRINT_SUBSCRIPTION")

  case object AppPremiumTier extends AcquisitionProduct("APP_PREMIUM_TIER")

  def fromString(code: String): Option[AcquisitionProduct] = {
    List(Contribution, RecurringContribution, SupporterPlus, DigitalSubscription, Paper, GuardianWeekly, AppPremiumTier)
      .find(
        _.value == code,
      )
  }

  implicit val decoder: Decoder[AcquisitionProduct] =
    Decoder.decodeString.emap(code => AcquisitionProduct.fromString(code).toRight(s"unrecognised product '$code'"))

  implicit val encoder: Encoder[AcquisitionProduct] = Encoder.encodeString.contramap[AcquisitionProduct](_.value)

}

sealed abstract class PrintProduct(val value: String)

object PrintProduct {

  case object HomeDeliveryEveryday extends PrintProduct("HOME_DELIVERY_EVERYDAY")

  case object HomeDeliveryEverydayPlus extends PrintProduct("HOME_DELIVERY_EVERYDAY_PLUS")

  case object HomeDeliverySixday extends PrintProduct("HOME_DELIVERY_SIXDAY")

  case object HomeDeliverySixdayPlus extends PrintProduct("HOME_DELIVERY_SIXDAY_PLUS")

  case object HomeDeliveryWeekend extends PrintProduct("HOME_DELIVERY_WEEKEND")

  case object HomeDeliveryWeekendPlus extends PrintProduct("HOME_DELIVERY_WEEKEND_PLUS")

  case object HomeDeliverySaturday extends PrintProduct("HOME_DELIVERY_SATURDAY")

  case object HomeDeliverySaturdayPlus extends PrintProduct("HOME_DELIVERY_SATURDAY_PLUS")

  case object HomeDeliverySunday extends PrintProduct("HOME_DELIVERY_SUNDAY")

  case object HomeDeliverySundayPlus extends PrintProduct("HOME_DELIVERY_SUNDAY_PLUS")

  case object VoucherEveryday extends PrintProduct("VOUCHER_EVERYDAY")

  case object VoucherEverydayPlus extends PrintProduct("VOUCHER_EVERYDAY_PLUS")

  case object VoucherSixday extends PrintProduct("VOUCHER_SIXDAY")

  case object VoucherSixdayPlus extends PrintProduct("VOUCHER_SIXDAY_PLUS")

  case object VoucherWeekend extends PrintProduct("VOUCHER_WEEKEND")

  case object VoucherWeekendPlus extends PrintProduct("VOUCHER_WEEKEND_PLUS")

  case object VoucherSaturday extends PrintProduct("VOUCHER_SATURDAY")

  case object VoucherSaturdayPlus extends PrintProduct("VOUCHER_SATURDAY_PLUS")

  case object VoucherSunday extends PrintProduct("VOUCHER_SUNDAY")

  case object VoucherSundayPlus extends PrintProduct("VOUCHER_SUNDAY_PLUS")

  case object GuardianWeekly extends PrintProduct("GUARDIAN_WEEKLY")

  def fromString(code: String): Option[PrintProduct] = {
    List(
      HomeDeliveryEveryday,
      HomeDeliveryEverydayPlus,
      HomeDeliverySixday,
      HomeDeliverySixdayPlus,
      HomeDeliveryWeekend,
      HomeDeliveryWeekendPlus,
      HomeDeliverySaturday,
      HomeDeliverySaturdayPlus,
      HomeDeliverySunday,
      HomeDeliverySundayPlus,
      VoucherEveryday,
      VoucherEverydayPlus,
      VoucherSixday,
      VoucherSixdayPlus,
      VoucherWeekend,
      VoucherWeekendPlus,
      VoucherSaturday,
      VoucherSaturdayPlus,
      VoucherSunday,
      VoucherSundayPlus,
      GuardianWeekly,
    ).find(_.value == code)
  }

  implicit val decoder: Decoder[PrintProduct] =
    Decoder.decodeString.emap(code => PrintProduct.fromString(code).toRight(s"unrecognised print product '$code'"))

  implicit val encoder: Encoder[PrintProduct] = Encoder.encodeString.contramap[PrintProduct](_.value)

}

sealed abstract class PaymentProvider(val value: String)

object PaymentProvider {
  case object Stripe extends PaymentProvider("STRIPE")

  case object StripeApplePay extends PaymentProvider("STRIPE_APPLE_PAY")

  case object StripePaymentRequestButton extends PaymentProvider("STRIPE_PAYMENT_REQUEST_BUTTON")

  case object StripeSepa extends PaymentProvider("STRIPE_SEPA")

  case object PayPal extends PaymentProvider("PAYPAL")

  case object DirectDebit extends PaymentProvider("GOCARDLESS")

  case object AmazonPay extends PaymentProvider("AMAZON_PAY")

  case object InAppPurchase extends PaymentProvider("IN_APP_PURCHASE")

  def fromString(code: String): Option[PaymentProvider] = {
    List(Stripe, StripeApplePay, StripePaymentRequestButton, StripeSepa, PayPal, DirectDebit, AmazonPay, InAppPurchase)
      .find(_.value == code)
  }

  implicit val decoder: Decoder[PaymentProvider] =
    Decoder.decodeString.emap(code =>
      PaymentProvider.fromString(code).toRight(s"unrecognised payment provider '$code'"),
    )

  implicit val encoder: Encoder[PaymentProvider] = Encoder.encodeString.contramap[PaymentProvider](_.value)

}
