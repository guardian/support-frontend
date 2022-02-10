package model.db

import java.time.format.DateTimeFormatter
import java.time.{Instant, LocalDateTime, ZoneId, ZoneOffset}
import java.util.UUID

import cats.implicits._
import com.amazon.pay.response.model.AuthorizationDetails
import com.paypal.api.payments.Payment
import com.stripe.model.Charge
import com.typesafe.scalalogging.StrictLogging
import model.PaymentProvider.AmazonPay
import model.acquisition.StripeCharge
import model.paypal.PaypalApiError
import model.{Currency, PaymentProvider, PaymentStatus}

import scala.util.Try

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
    contributionId: UUID = UUID.randomUUID,
)

object ContributionData extends StrictLogging {

  private def paypalDateToLocalDateTime(dateTime: String): LocalDateTime = {
    // -- paypal date example 2018-02-22T11:51:00Z -> DateTimeFormatter.ISO_INSTANT
    val formatter = DateTimeFormatter.ISO_INSTANT.withZone(ZoneId.systemDefault())
    LocalDateTime.parse(dateTime, formatter)
  }

  def fromStripeCharge(
      identityId: Option[Long],
      charge: Charge,
      countrySubdivisionCode: Option[String],
      paymentProvider: PaymentProvider,
  ): ContributionData =
    // TODO: error handling
    ContributionData(
      paymentProvider = paymentProvider,
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
      countryCode = StripeCharge.getCountryCode(charge),
      countrySubdivisionCode = countrySubdivisionCode,
    )

  import scala.collection.JavaConverters._

  // Couple of notes:
  // - using (deprecated) shipping address as unable to get state from billing address
  // - on event of not being able to get state from shipping address,
  //   don't fallback to region header set by Fastly,
  //   since currently the only client of the payment API is support-frontend
  //   and this service makes the request to execute the payment server side,
  //   resulting in the region header always being Dublin i.e. where the server is hosted.
  private def getPaypalCountrySubdivisionCode(payment: Payment): Option[String] =
    Try(payment.getPayer.getPayerInfo.getShippingAddress.getState).toOption.flatMap(Option(_))

  def fromPaypalCharge(
      payment: Payment,
      email: String,
      identityId: Option[Long],
      countrySubdivisionCode: Option[String],
  ): Either[PaypalApiError, ContributionData] = {
    for {
      transactions <- Either.fromOption(
        payment.getTransactions.asScala.headOption,
        PaypalApiError
          .fromString(s"Invalid Paypal transactions content."),
      )
      currency <- Either
        .catchNonFatal(Currency.withNameInsensitive(transactions.getAmount.getCurrency))
        .leftMap(PaypalApiError.fromThrowable)
      amount <- Either
        .catchNonFatal(BigDecimal(payment.getTransactions.asScala.head.getAmount.getTotal))
        .leftMap(PaypalApiError.fromThrowable)
      created <- Either
        .catchNonFatal(paypalDateToLocalDateTime(payment.getCreateTime))
        .leftMap(PaypalApiError.fromThrowable)
      countryCode <- Either
        .catchNonFatal(payment.getPayer.getPayerInfo.getCountryCode)
        .leftMap(PaypalApiError.fromThrowable)
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
      countrySubdivisionCode = getPaypalCountrySubdivisionCode(payment),
    )
  }

  def fromAmazonPay(
      amazonPayment: AuthorizationDetails,
      identity: Option[Long],
      email: String,
      countryCode: Option[String],
      countrySubdivisionCode: Option[String],
      orderRef: String,
  ): ContributionData = {
    ContributionData(
      paymentProvider = AmazonPay,
      paymentStatus = PaymentStatus.Paid,
      paymentId = orderRef,
      identityId = identity,
      email = email,
      // Time at which the object was created. Measured in seconds since the Unix epoch.
      created = LocalDateTime
        .ofInstant(
          Instant.ofEpochMilli(amazonPayment.getCreationTimestamp.toGregorianCalendar.getTimeInMillis),
          ZoneOffset.UTC,
        ),
      currency = Currency.withNameInsensitive(amazonPayment.getAuthorizationAmount.getCurrencyCode),
      amount = BigDecimal(amazonPayment.getAuthorizationAmount.getAmount),
      countryCode = countryCode,
      countrySubdivisionCode = countrySubdivisionCode,
    )
  }
}
