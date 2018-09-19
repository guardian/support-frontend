package com.gu.emailservices

import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import io.circe.generic.auto._
import io.circe.syntax._

case class EmailPayloadContactAttributes(SubscriberAttributes: Map[String, String])
case class EmailPayloadTo(Address: String, SubscriberKey: String, ContactAttributes: EmailPayloadContactAttributes)
case class EmailPayload(To: EmailPayloadTo, DataExtensionName: String, SfContactId: Option[String], IdentityUserId: Option[String]) {
  lazy val jsonString: String = this.asJson.toString
}

trait EmailFields {

  val fields: List[(String, String)] = Nil

  def payload: String
  def sfContactId: Option[String]
  def identityId: Option[String]

  protected def payload(email: String, dataExtensionName: String): String = {
    EmailPayload(
      To = EmailPayloadTo(
        Address = email,
        SubscriberKey = email,
        ContactAttributes = EmailPayloadContactAttributes(SubscriberAttributes = fields.toMap)
      ),
      DataExtensionName = dataExtensionName,
      SfContactId = sfContactId,
      IdentityUserId = identityId
    ).jsonString
  }

  protected def mask(s: String): String = s.replace(s.substring(0, 6), "******")
  protected def hyphenate(s: String): String = s"${s.substring(0, 2)}-${s.substring(2, 4)}-${s.substring(4, 6)}"
  protected def formatPrice(price: BigDecimal): String = price.bigDecimal.stripTrailingZeros.toPlainString
  protected def formatDate(d: DateTime): String = DateTimeFormat.forPattern("EEEE, d MMMM yyyy").print(d)
}
