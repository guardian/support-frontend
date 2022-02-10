package com.gu.support.acquisitions.models

import com.gu.i18n.{Country, Currency}
import com.gu.support.acquisitions.{AbTest, QueryParameter}
import com.gu.support.zuora.api.ReaderType
import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat
import io.circe.generic.auto._
import io.circe.{Decoder, Encoder}

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

  implicit val decoder = Decoder[AcquisitionDataRow]
  implicit val encoder = Encoder[AcquisitionDataRow]
}

case class PrintOptions(
    product: PrintProduct,
    deliveryCountry: Country,
)

sealed abstract class PaymentFrequency(val value: String)

object PaymentFrequency {
  case object OneOff extends PaymentFrequency("ONE_OFF")

  case object Monthly extends PaymentFrequency("MONTHLY")

  case object Quarterly extends PaymentFrequency("QUARTERLY")

  case object Annually extends PaymentFrequency("ANNUALLY")
}

sealed abstract class AcquisitionProduct(val value: String)

object AcquisitionProduct {

  case object Contribution extends AcquisitionProduct("CONTRIBUTION")

  case object RecurringContribution extends AcquisitionProduct("RECURRING_CONTRIBUTION")

  case object DigitalSubscription extends AcquisitionProduct("DIGITAL_SUBSCRIPTION")

  case object Paper extends AcquisitionProduct("PRINT_SUBSCRIPTION")

  case object GuardianWeekly extends AcquisitionProduct("PRINT_SUBSCRIPTION")

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
}
