package model.stripe

import io.circe.generic.JsonCodec

import model.Currency

// Data required to create a charge.
// https://stripe.com/docs/api/java#create_charge
// TODO: note about email
@JsonCodec case class StripeChargeData(currency: Currency, amount: Int, source: String, receiptEmail: String)