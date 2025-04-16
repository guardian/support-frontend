package com.gu.support.workers.exceptions

object CardDeclinedMessages {
  val errorMessages = List(
    "Transaction declined.402 - [card_error/card_declined/do_not_honor] Your card was declined.",
    "Transaction declined.402 - [card_error/card_declined/insufficient_funds] Your card has insufficient funds.",
    "Transaction declined.402 - [card_error/card_declined/try_again_later] Your card was declined.",
    "Transaction declined.402 - [card_error/card_declined/transaction_not_allowed] Your card does not support this type of purchase.",
    "Transaction declined.402 - [card_error/card_declined/pickup_card] Your card was declined.",
    "Transaction declined.10417 - Instruct the customer to retry the transaction using an alternative payment method from the customers PayPal wallet.",
    "Transaction declined.validation_failed - account_number did not pass modulus check",
  )
  def alarmShouldBeSuppressedForErrorMessage(message: String): Boolean = {
    errorMessages.exists(messageToIgnore => message.contains(messageToIgnore))
  }
}
