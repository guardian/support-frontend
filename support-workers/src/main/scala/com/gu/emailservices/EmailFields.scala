package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.promotions.Promotion
import com.gu.support.workers.{BillingPeriod, User}
import io.circe.Encoder
import io.circe.generic.semiauto._
import io.circe.syntax._

case class EmailPayloadContactAttributes(SubscriberAttributes: Map[String, String])
case class EmailPayloadTo(Address: String, ContactAttributes: EmailPayloadContactAttributes)
case class EmailPayload(To: EmailPayloadTo, DataExtensionName: String, SfContactId: Option[String], IdentityUserId: Option[String])

object EmailPayload {
  implicit val e1: Encoder[EmailPayload] = deriveEncoder
  implicit val e2: Encoder[EmailPayloadTo] = deriveEncoder
  implicit val e3: Encoder[EmailPayloadContactAttributes] = deriveEncoder
}

case class IdentityUserId(id: String)

case class EmailFields(
  fields: List[(String, String)],
  userId: Either[SfContactId, IdentityUserId],
  email: String,
  dataExtensionName: String
) {

  def payload: String = {
    EmailPayload(
      To = EmailPayloadTo(
        Address = email,
        ContactAttributes = EmailPayloadContactAttributes(SubscriberAttributes = fields.toMap)
      ),
      DataExtensionName = dataExtensionName,
      SfContactId = userId.left.toOption.map(_.id),
      IdentityUserId = userId.right.toOption.map(_.id)
    ).asJson.spaces2
  }

}
