package com.gu.patrons.model

sealed trait Error {
  val message: String
}

case class ConfigLoadingError(message: String) extends Error

case class InvalidRequestError(message: String) extends Error

case class InvalidJsonError(message: String) extends Error

case class UserNotFoundIdentityError(message: String) extends Error

case class UserNotFoundStripeError(message: String) extends Error

case class DynamoDbError(message: String) extends Error
