package com.gu.support.redemption

sealed abstract class CodeStatus(val clientCode: String)

sealed abstract class ValidCode(clientCode: String) extends CodeStatus(clientCode)

sealed abstract class InvalidCode(clientCode: String) extends CodeStatus(clientCode)

case object CodeNotFound extends CodeStatus("code_not_found")

case object CodeMalformed extends InvalidCode("code_malformed")

case object CodeAlreadyUsed extends InvalidCode("code_already_used")

case object CodeExpired extends InvalidCode("code_expired")

case object InvalidReaderType extends InvalidCode("invalid_reader_type")

object ValidGiftCode { val clientCode = "valid_gift_code" }
object CodeRedeemedInThisRequest { val clientCode = "redeemed_in_this_request" }

case class ValidGiftCode(subscriptionId: String) extends ValidCode(ValidGiftCode.clientCode)

// This can happen if Zuora is responding very slowly - a redemption request may succeed but not return a response
// until after the CreateZuoraSubscription lambda has timed out meaning that the redemption will be retried with the
// same requestId. In this case we want the lambda to succeed so that we progress to the next lambda
case class CodeRedeemedInThisRequest(subscriptionId: String) extends ValidCode(CodeRedeemedInThisRequest.clientCode)
