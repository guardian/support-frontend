package model.db

import java.time.{LocalDateTime, ZoneOffset}
import java.util.UUID

import com.stripe.model.Charge

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
}
