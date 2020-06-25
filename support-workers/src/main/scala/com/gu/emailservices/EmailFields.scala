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

trait EmailFields {

  val fields: List[(String, String)] = Nil

  def payload: String
  def userId: Either[SfContactId, IdentityUserId]

  protected def payload(email: String, dataExtensionName: String): String = {
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

trait AllProductsEmailFields {

  def apply(
    billingPeriod: BillingPeriod,
    user: User,
    currency: Currency,
    sfContactId: SfContactId,
    directDebitMandateId: Option[String],
  ): EmailFields

}
object SubscriptionEmailFields {
  def wrap(allProductsEmailFields: AllProductsEmailFields): SubscriptionEmailFields = (_: String, _: Option[Promotion]) =>
    allProductsEmailFields
}
trait SubscriptionEmailFields {

  def apply(
    subscriptionNumber: String,
    promotion: Option[Promotion] = None
  ): AllProductsEmailFields

}
