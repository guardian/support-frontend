package model.paypal

import io.circe.generic.JsonCodec
import model.Currency


/*
 * Only used by desktop, mobile has a different paypal flow.
 * Web: create paypal payment (sale) -> execute
 * App: create paypal payment (auth directly form mobile app) -> capture
 */
@JsonCodec case class CreatePaypalPaymentData(
    currency: Currency,
    amount: BigDecimal,
    returnURL: String,
    cancelURL: String)
