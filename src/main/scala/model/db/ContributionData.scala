package model.db

import java.time.format.DateTimeFormatter
import java.time.{LocalDateTime, ZoneId, ZoneOffset}
import java.util.UUID

import cats.implicits._
import com.paypal.api.payments.Payment
import com.stripe.model.Charge
import com.typesafe.scalalogging.StrictLogging

import model.acquisition.StripeSource
import model.paypal.PaypalApiError
import model.{Currency, PaymentProvider, PaymentStatus}

case class ContributionData private (
    paymentProvider: PaymentProvider,
    paymentStatus: PaymentStatus,
    paymentId: String,
    identityId: Option[Long],
    email: String,
    created: LocalDateTime,
    currency: Currency,
    amount: BigDecimal,
    countryCode: Option[String],
    countrySubdivisionCode: Option[String],
    // Used as primary key on current contribution_metadata and payment_hooks table
    // https://github.com/guardian/contributions-platform/blob/master/Postgres/schema.sql
    contributionId: UUID = UUID.randomUUID
)

object ContributionData extends StrictLogging {

  private def paypalDateToLocalDateTime(dateTime: String): LocalDateTime = {
    //-- paypal date example 2018-02-22T11:51:00Z -> DateTimeFormatter.ISO_INSTANT
    val formatter = DateTimeFormatter.ISO_INSTANT.withZone(ZoneId.systemDefault())
    LocalDateTime.parse(dateTime, formatter)
  }

  def fromStripeCharge(identityId: Option[Long], charge: Charge, countrySubdivisionCode: Option[String]): ContributionData =
    // TODO: error handling
    ContributionData(
      paymentProvider = PaymentProvider.Stripe,
      paymentStatus = PaymentStatus.Paid,
      paymentId = charge.getId,
      identityId = identityId,
      email = charge.getReceiptEmail,
      // From the Stripe documentation for charge.created
      // Time at which the object was created. Measured in seconds since the Unix epoch.
      created = LocalDateTime.ofEpochSecond(charge.getCreated, 0, ZoneOffset.UTC),
      // Stripe can return currency in lower case
      currency = Currency.withNameInsensitive(charge.getCurrency),
      amount = BigDecimal(charge.getAmount, 2),
      countryCode = StripeSource.getCountryCode(charge),
      countrySubdivisionCode = countrySubdivisionCode
    )

  import scala.collection.JavaConverters._

  private def getPaypalCountrySubdivisionCode(payment: Payment, countrySubdivisionCode: Option[String]): Option[String] = {
    Either.catchNonFatal(payment.getPayer.getPayerInfo.getBillingAddress.getState)
      .fold(
        err => {
          logger.warn("unable to get state from Paypal payment, using fallback", err)
          countrySubdivisionCode
        },
        state => Some(state)
      )
  }

  def fromPaypalCharge(payment: Payment, email: String, identityId: Option[Long], countrySubdivisionCode: Option[String]): Either[PaypalApiError, ContributionData] = {
    for {
      transactions <- Either.fromOption(payment.getTransactions.asScala.headOption, PaypalApiError
        .fromString(s"Invalid Paypal transactions content."))
      currency <- Either.catchNonFatal(Currency.withNameInsensitive(transactions.getAmount.getCurrency)).leftMap(PaypalApiError.fromThrowable)
      amount <- Either.catchNonFatal(BigDecimal(payment.getTransactions.asScala.head.getAmount.getTotal)).leftMap(PaypalApiError.fromThrowable)
      created <- Either.catchNonFatal(paypalDateToLocalDateTime(payment.getCreateTime)).leftMap(PaypalApiError.fromThrowable)
      countryCode <- Either.catchNonFatal(payment.getPayer.getPayerInfo.getCountryCode).leftMap(PaypalApiError.fromThrowable)
    } yield ContributionData(
      paymentProvider = PaymentProvider.Paypal,
      paymentStatus = PaymentStatus.Paid,
      paymentId = payment.getId,
      identityId = identityId,
      email = email,
      created = created,
      currency = currency,
      amount = amount,
      countryCode = Some(countryCode),
      countrySubdivisionCode = getPaypalCountrySubdivisionCode(payment, countrySubdivisionCode)
    )
  }
}
