package models

import com.gu.support.workers.Address
import services.stepfunctions.CreateSupportWorkersRequest

import java.security.MessageDigest

object FormFieldsHash {
  def createFromSupportWorkersRequest(supportWorkersRequest: CreateSupportWorkersRequest): String = {
    create(
      email = supportWorkersRequest.email,
      firstName = supportWorkersRequest.firstName,
      lastName = supportWorkersRequest.lastName,
      telephoneNumber = supportWorkersRequest.telephoneNumber,
      billingAddress = supportWorkersRequest.billingAddress,
      deliveryAddress = supportWorkersRequest.deliveryAddress,
      deliveryInstructions = supportWorkersRequest.deliveryInstructions,
    )
  }

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
