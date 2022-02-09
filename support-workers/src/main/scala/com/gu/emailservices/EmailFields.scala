package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.promotions.Promotion
import com.gu.support.workers.{BillingPeriod, User}
import io.circe.{Encoder, JsonObject, Printer}
import io.circe.generic.semiauto._
import io.circe.syntax._
import org.joda.time.{DateTime, DateTimeZone, LocalDate, LocalTime}
import com.gu.support.encoding.CustomCodecs._
import org.joda.time.format.ISODateTimeFormat

case class EmailPayloadContactAttributes(SubscriberAttributes: Map[String, String])
case class EmailPayloadTo(Address: String, ContactAttributes: EmailPayloadContactAttributes)
case class EmailPayload(
    To: EmailPayloadTo,
    DataExtensionName: String,
    SfContactId: Option[String], // this should only be used where no identity account exists e.g. giftee notification
    IdentityUserId: Option[String],
    ScheduledTime: Option[DateTime], // None means immediate
    UserAttributes: Option[JsonObject],
)

object EmailPayload {
  import com.gu.support.encoding.CustomCodecs.ISODate.encodeDateTime

  implicit val e1: Encoder[EmailPayload] = deriveEncoder
  implicit val e2: Encoder[EmailPayloadTo] = deriveEncoder
  implicit val e3: Encoder[EmailPayloadContactAttributes] = deriveEncoder
}

case class IdentityUserId(id: String)

case class EmailFields(
    fields: List[(String, String)],
    userId: Either[SfContactId, IdentityUserId],
    email: String,
    dataExtensionName: String,
    deliveryDate: Option[LocalDate],
    userAttributes: Option[JsonObject],
) {

  def payload: String =
    EmailPayload(
      To = EmailPayloadTo(
        Address = email,
        ContactAttributes = EmailPayloadContactAttributes(SubscriberAttributes = fields.toMap),
      ),
      DataExtensionName = dataExtensionName,
      SfContactId = userId.left.toOption.map(_.id),
      IdentityUserId = userId.toOption.map(_.id),
      deliveryDate.map(_.toDateTime(new LocalTime(8, 0), DateTimeZone.UTC)),
      userAttributes,
    ).asJson.printWith(Printer.spaces2.copy(dropNullValues = true))

}

object EmailFields {
  def apply(
      fields: List[(String, String)],
      user: User,
      dataExtensionName: String,
      userAttributes: Option[JsonObject] = None,
  ): EmailFields =
    new EmailFields(
      fields,
      Right(IdentityUserId(user.id)),
      user.primaryEmailAddress,
      dataExtensionName,
      None,
      userAttributes = userAttributes,
    )
}
