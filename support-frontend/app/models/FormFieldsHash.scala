package models

import services.stepfunctions.CreateSupportWorkersRequest
import java.security.MessageDigest

object FormFieldsHash {
  def create(supportWorkersRequest: CreateSupportWorkersRequest) = {
    val fields = List(
      supportWorkersRequest.email,
      supportWorkersRequest.firstName,
      supportWorkersRequest.lastName,
      supportWorkersRequest.telephoneNumber.getOrElse(""),
      supportWorkersRequest.email,
      supportWorkersRequest.telephoneNumber,
      supportWorkersRequest.billingAddress.toString,
      supportWorkersRequest.deliveryAddress.map(_.toString).getOrElse(""),
      supportWorkersRequest.deliveryInstructions.getOrElse(""),
    ).mkString("|")

    MessageDigest
      .getInstance("SHA-256")
      .digest(fields.getBytes("UTF-8"))
      .map("%02x".format(_))
      .mkString
  }
}
