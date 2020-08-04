package com.gu.emailservices

import com.gu.i18n.Currency
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.promotions.Promotion
import com.gu.support.workers.{BillingPeriod, User}
import io.circe.generic.auto._
import io.circe.syntax._

case class EmailPayloadContactAttributes(SubscriberAttributes: Map[String, String])
case class EmailPayloadTo(Address: String, ContactAttributes: EmailPayloadContactAttributes)
case class EmailPayload(To: EmailPayloadTo, DataExtensionName: String, SfContactId: Option[String], IdentityUserId: Option[String]) {
  lazy val jsonString: String = this.asJson.toString
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
    ).jsonString
  }

}

trait AllProductsEmailFieldsBuilder {

  def buildWith(
    billingPeriod: BillingPeriod,
    user: User,
    currency: Currency,
    sfContactId: SfContactId,
    directDebitMandateId: Option[String],
  ): EmailFields

}
object SubscriptionEmailFieldsBuilder {
  def wrap(allProductsEmailFields: AllProductsEmailFieldsBuilder): SubscriptionEmailFieldsBuilder = (_: String, _: Option[Promotion]) =>
    allProductsEmailFields
}
trait SubscriptionEmailFieldsBuilder {

  def buildWith(
    subscriptionNumber: String,
    promotion: Option[Promotion] = None
  ): AllProductsEmailFieldsBuilder

}
