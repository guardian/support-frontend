package model.stripe

import io.circe.generic.JsonCodec

import model.Currency
import model.db.ContributionData

// TODO: currency type
@JsonCodec case class StripeChargeSuccess private (currency: Currency, amount: Long)

object StripeChargeSuccess {
  def fromContributionData(data: ContributionData): StripeChargeSuccess =
    StripeChargeSuccess(data.currency, data.amount)
}
