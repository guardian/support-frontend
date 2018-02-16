package model.db

import java.time.LocalDateTime
import java.util.UUID

import model.stripe.StripeChargeSuccess

// Should be created from a StripeChargeSuccess or ... (Paypal)
case class ContributionData private (
    receiptEmail: String,
    created: LocalDateTime, // TODO: correct type
    currency: String,       // TODO: use Currency type?
    amount: Long,
    identityId: Option[String],
    // Used as primary key on current contribution_metadata and payment_hooks table
    // https://github.com/guardian/contributions-platform/blob/master/Postgres/schema.sql
    contributionId: UUID = UUID.randomUUID
)

object ContributionData {

  def fromStripeChargeSuccess(data: StripeChargeSuccess): ContributionData =
    ContributionData(
      receiptEmail = data.email,
      created = LocalDateTime.now, // TODO
      currency = data.currency,
      amount = data.amount,
      identityId = None // TODO
    )
}
