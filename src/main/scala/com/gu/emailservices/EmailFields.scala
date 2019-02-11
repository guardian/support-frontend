package com.gu.emailservices

import org.joda.time.LocalDate
import org.joda.time.format.DateTimeFormat
import io.circe.generic.auto._
import io.circe.syntax._
import com.gu.salesforce.Salesforce.SfContactId

// scalastyle:off
case class EmailPayloadContactAttributes(SubscriberAttributes: Map[String, String])
case class EmailPayloadTo(Address: String, SubscriberKey: String, ContactAttributes: EmailPayloadContactAttributes)
case class EmailPayload(To: EmailPayloadTo, DataExtensionName: String, SfContactId: Option[String], IdentityUserId: Option[String]) {
  lazy val jsonString: String = this.asJson.toString
}
// scalastyle:on

case class IdentityUserId(id: String)

trait EmailFields {

  val fields: List[(String, String)] = Nil

  def payload: String
  def userId: Either[SfContactId, IdentityUserId]

  protected def payload(email: String, dataExtensionName: String): String = {
    EmailPayload(
      To = EmailPayloadTo(
        Address = email,
        SubscriberKey = email,
        ContactAttributes = EmailPayloadContactAttributes(SubscriberAttributes = fields.toMap)
      ),
      DataExtensionName = dataExtensionName,
      SfContactId = userId.left.toOption.map(_.id),
      IdentityUserId = userId.right.toOption.map(_.id)
    ).jsonString
  }

  protected def mask(s: String): String = s.replace(s.substring(0, 6), "******")
  protected def hyphenate(s: String): String = s"${s.substring(0, 2)}-${s.substring(2, 4)}-${s.substring(4, 6)}"
  protected def formatDate(d: LocalDate): String = DateTimeFormat.forPattern("EEEE, d MMMM yyyy").print(d)
}
