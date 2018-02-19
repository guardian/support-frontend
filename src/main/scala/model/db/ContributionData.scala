package model.db

import java.time.{LocalDateTime, ZoneOffset}
import java.util.UUID

import com.stripe.model.Charge

import model.{PaymentProvider, PaymentStatus}

case class ContributionData private (
    paymentProvider: PaymentProvider,
    paymentStatus: PaymentStatus,
    paymentId: String,
    identityId: Option[String],
    receiptEmail: String,
    created: LocalDateTime, // TODO: correct type
    currency: String, // TODO: use Currency type?
    amount: Long,
    // Used as primary key on current contribution_metadata and payment_hooks table
    // https://github.com/guardian/contributions-platform/blob/master/Postgres/schema.sql
    contributionId: UUID = UUID.randomUUID
)

object ContributionData {

  def fromStripeCharge(identityId: Option[String], charge: Charge): ContributionData =
    ContributionData(
      paymentProvider = PaymentProvider.Stripe,
      paymentStatus = PaymentStatus.Paid,
      paymentId = charge.getId,
      identityId = identityId,
      receiptEmail = charge.getReceiptEmail,
      // From the Stripe documentation for charge.created
      // Time at which the object was created. Measured in seconds since the Unix epoch.
      created = LocalDateTime.ofEpochSecond(charge.getCreated, 0, ZoneOffset.UTC),
      currency = charge.getCurrency,
      amount = charge.getAmount
    )
}
