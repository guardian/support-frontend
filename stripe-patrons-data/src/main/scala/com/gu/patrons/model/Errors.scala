package com.gu.patrons.model

sealed trait CancelError {
  val message: String
}

sealed trait SignUpError {
  val message: String
}

case class ConfigLoadingError(message: String) extends CancelError with SignUpError

case class InvalidRequestError(message: String) extends CancelError with SignUpError

case class InvalidJsonError(message: String) extends CancelError with SignUpError

case class UserNotFoundIdentityError(message: String) extends CancelError

case class UserNotFoundStripeError(message: String) extends CancelError

case class SubscriptionNotFoundDynamo(message: String) extends CancelError

case class DynamoDbError(message: String) extends CancelError

case class StripeGetCustomerFailedError(message: String) extends SignUpError

case class SubscriptionProcessingError(message: String) extends SignUpError
