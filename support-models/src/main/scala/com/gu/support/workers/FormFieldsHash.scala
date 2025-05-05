package com.gu.support.workers

import java.security.MessageDigest

object FormFieldsHash {
  val fieldName = "form_fields_hash"

  def create(
      email: String,
      firstName: String,
      lastName: String,
      telephoneNumber: Option[String],
      billingAddress: Address,
      deliveryAddress: Option[Address],
      deliveryInstructions: Option[String],
  ): String = {
    val fields = List(
      email,
      firstName,
      lastName,
      telephoneNumber.getOrElse(""),
      billingAddress.toString,
      deliveryAddress.map(_.toString).getOrElse(""),
      deliveryInstructions.getOrElse(""),
    ).mkString("|")

    MessageDigest
      .getInstance("SHA-256")
      .digest(fields.getBytes("UTF-8"))
      .map("%02x".format(_))
      .mkString
  }
}
