package com.gu.support.redemption

import com.gu.support.redemption.corporate.GetCodeStatus.CorporateId

sealed abstract class RedemptionValidationResult(val clientCode: String)

sealed abstract class ValidCode(clientCode: String) extends RedemptionValidationResult(clientCode)

sealed abstract class InvalidCode(clientCode: String) extends RedemptionValidationResult(clientCode)

case object CodeNotFound extends RedemptionValidationResult("code_not_found")

case object CodeAlreadyUsed extends InvalidCode("code_already_used")

case object CodeExpired extends InvalidCode("code_expired")

case object InvalidReaderType extends InvalidCode("invalid_reader_type")

case class ValidGiftCode(subscriptionId: String) extends ValidCode("valid_gift_code")

// This can happen if Zuora is responding very slowly - a redemption request may succeed but not return a response
// until after the CreateZuoraSubscription lambda has timed out meaning that the redemption will be retried with the
// same requestId. In this case we want the lambda to succeed so that we progress to the next lambda
case object CodeRedeemedInThisRequest extends ValidCode("redeemed_in_this_request")

case class ValidCorporateCode(corporateId: CorporateId) extends ValidCode("valid_corporate_code")
