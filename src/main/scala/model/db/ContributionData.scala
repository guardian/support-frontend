package model.db

import java.time.format.DateTimeFormatter
import java.time.{LocalDateTime, ZoneId, ZoneOffset}
import java.util.UUID
import cats.implicits._
import com.paypal.api.payments.Payment
import com.stripe.model.Charge
import model.paypal.PaypalApiError
import model.{Currency, PaymentProvider, PaymentStatus}

case class ContributionData private (
    paymentProvider: PaymentProvider,
    paymentStatus: PaymentStatus,
    paymentId: String,
    identityId: Option[String],
    receiptEmail: String,
    created: LocalDateTime,
    currency: Currency,
    amount: Long,
    // Used as primary key on current contribution_metadata and payment_hooks table
    // https://github.com/guardian/contributions-platform/blob/master/Postgres/schema.sql
    contributionId: UUID = UUID.randomUUID
)

object ContributionData {

  private def paypalDateToLocalDateTime(dateTime: String): LocalDateTime = {
    //-- paypal date example 2018-02-22T11:51:00Z -> DateTimeFormatter.ISO_INSTANT
    val formatter = DateTimeFormatter.ISO_INSTANT.withZone(ZoneId.systemDefault())
    LocalDateTime.parse(dateTime, formatter)
  }

  def fromStripeCharge(identityId: Option[String], charge: Charge): ContributionData =
    // TODO: error handling
    ContributionData(
      paymentProvider = PaymentProvider.Stripe,
      paymentStatus = PaymentStatus.Paid,
      paymentId = charge.getId,
      identityId = identityId,
      receiptEmail = charge.getReceiptEmail,
      // From the Stripe documentation for charge.created
      // Time at which the object was created. Measured in seconds since the Unix epoch.
      created = LocalDateTime.ofEpochSecond(charge.getCreated, 0, ZoneOffset.UTC),
      // Stripe can return currency in lower case
      currency = Currency.withNameInsensitive(charge.getCurrency),
      amount = charge.getAmount
    )

  import scala.collection.JavaConverters._

  def fromPaypalCharge(identityId: Option[String], payment: Payment): Either[PaypalApiError, ContributionData] = {
    for {
      transactions <- Either.fromOption(payment.getTransactions.asScala.headOption, PaypalApiError
        .fromString(s"Invaid Paypal transactions content."))
      currency <- Either.catchNonFatal(Currency.withNameInsensitive(transactions.getAmount.getCurrency)).leftMap(PaypalApiError.fromThrowable)
      amount <- Either.catchNonFatal(BigDecimal(payment.getTransactions.asScala.head.getAmount.getTotal).toLong).leftMap(PaypalApiError.fromThrowable)
      created <- Either.catchNonFatal(paypalDateToLocalDateTime(payment.getCreateTime)).leftMap(PaypalApiError.fromThrowable)
    } yield ContributionData(
      paymentProvider = PaymentProvider.Paypal,
      paymentStatus = PaymentStatus.Paid,
      paymentId = payment.getId,
      identityId = identityId,
      receiptEmail = payment.getPayer.getPayerInfo.getEmail,
      created = created,
      currency = currency,
      amount = amount
    )
  }

}
