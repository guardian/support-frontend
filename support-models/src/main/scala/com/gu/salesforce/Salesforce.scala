package com.gu.salesforce

import cats.syntax.functor._
import com.gu.i18n.Title
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.JsonHelpers.JsonObjectExtensions
import com.gu.support.workers.{GiftRecipient, SalesforceContactRecord, User}
import com.gu.support.workers.exceptions.{RetryException, RetryNone, RetryUnlimited}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}
import org.joda.time.DateTime
import AddressLine.getAddressLine

object Salesforce {

  implicit val salesforceContactRecordCodec: Codec[SalesforceContactRecord] = deriveCodec

  object NewContact {
    def forUser(user: User, giftRecipient: Option[GiftRecipient]): NewContact =
      giftRecipient
        .map(_ =>
          // If we have a gift recipient then don't update the delivery address
          NewContact(
            IdentityID__c = user.id,
            Email = user.primaryEmailAddress,
            Salutation = user.title,
            FirstName = user.firstName,
            LastName = user.lastName,
            // 'Other' address fields = billing address
            OtherStreet = getAddressLine(user.billingAddress),
            OtherCity = user.billingAddress.city,
            OtherState = user.billingAddress.state,
            OtherPostalCode = user.billingAddress.postCode,
            OtherCountry = user.billingAddress.country.name,
            // 'Mailing' address fields = delivery address
            MailingStreet = None,
            MailingCity = None,
            MailingState = None,
            MailingPostalCode = None,
            MailingCountry = None,
            Phone = user.telephoneNumber,
          ),
        )
        .getOrElse(
          NewContact(
            IdentityID__c = user.id,
            Email = user.primaryEmailAddress,
            Salutation = user.title,
            FirstName = user.firstName,
            LastName = user.lastName,
            OtherStreet = getAddressLine(user.billingAddress),
            OtherCity = user.billingAddress.city,
            OtherState = user.billingAddress.state,
            OtherPostalCode = user.billingAddress.postCode,
            OtherCountry = user.billingAddress.country.name,
            MailingStreet = getAddressLine(user.deliveryAddress.getOrElse(user.billingAddress)),
            MailingCity = user.deliveryAddress.flatMap(_.city),
            MailingState = user.deliveryAddress.flatMap(_.state),
            MailingPostalCode = user.deliveryAddress.flatMap(_.postCode),
            MailingCountry = user.deliveryAddress.map(_.country.name),
            Phone = user.telephoneNumber,
          ),
        )
    implicit val decoder: Decoder[NewContact] = deriveDecoder
    implicit val encoder: Encoder[NewContact] = deriveEncoder[NewContact].mapJsonObject(_.wrapObject("newContact"))
  }

  object DeliveryContact {
    implicit val decoder: Decoder[DeliveryContact] = deriveDecoder
    implicit val encoder: Encoder[DeliveryContact] = deriveEncoder[DeliveryContact]
      .mapJsonObject(
        _.add("RecordTypeId", Json.fromString("01220000000VB50AAG"))
          .wrapObject("newContact"),
      )
  }

  sealed trait UpsertData

  object UpsertData {
    implicit val encoder: Encoder[UpsertData] = Encoder.instance {
      case newContact: NewContact => newContact.asJson
      case deliveryContact: DeliveryContact => deliveryContact.asJson
    }

    implicit val decodeProduct: Decoder[UpsertData] =
      List[Decoder[UpsertData]](
        Decoder[NewContact].widen,
        Decoder[DeliveryContact].widen,
      ).reduceLeft(_ or _)
  }

  // The odd field names on these class are to match with the Salesforce api and allow us to serialise and deserialise
  // without a lot of custom mapping code
  case class NewContact(
      IdentityID__c: String,
      Email: String,
      Salutation: Option[Title],
      FirstName: String,
      LastName: String,
      OtherStreet: Option[String],
      OtherCity: Option[String],
      OtherState: Option[String],
      OtherPostalCode: Option[String],
      OtherCountry: String,
      MailingStreet: Option[String],
      MailingCity: Option[String],
      MailingState: Option[String],
      MailingPostalCode: Option[String],
      MailingCountry: Option[String],
      Phone: Option[String],
  ) extends UpsertData

  case class DeliveryContact(
      AccountId: String,
      Email: Option[String],
      Salutation: Option[Title],
      FirstName: String,
      LastName: String,
      MailingStreet: Option[String],
      MailingCity: Option[String],
      MailingState: Option[String],
      MailingPostalCode: Option[String],
      MailingCountry: Option[String],
  ) extends UpsertData

  case class SalesforceContactResponse(
      Success: Boolean,
      ErrorString: Option[String],
      ContactRecord: Option[SalesforceContactRecord],
  )
  object SalesforceContactResponse {
    implicit val codec: Codec[SalesforceContactResponse] = deriveCodec
  }

  case class SalesforceContactSuccess(
      Success: Boolean,
      ErrorString: Option[String],
      ContactRecord: SalesforceContactRecord,
  )

  object SalesforceContactSuccess {
    implicit val codec: Codec[SalesforceContactSuccess] = deriveCodec
  }

  case class SalesforceContactRecords(buyer: SalesforceContactRecord, giftRecipient: Option[SalesforceContactRecord]) {
    def recipient: SalesforceContactRecord = giftRecipient.getOrElse(buyer)
  }
  object SalesforceContactRecords {
    implicit val codec: Codec[SalesforceContactRecords] = deriveCodec
  }

  case class SalesforceContactRecordsResponse(
      buyer: SalesforceContactSuccess,
      giftRecipient: Option[SalesforceContactSuccess],
  ) {
    def successful: Boolean = buyer.Success && giftRecipient.forall(_.Success)

    def errorMessage: Option[String] = List(buyer.ErrorString, giftRecipient.flatMap(_.ErrorString)).flatten.headOption

    def contactRecords: SalesforceContactRecords =
      SalesforceContactRecords(buyer.ContactRecord, giftRecipient.map(_.ContactRecord))
  }

  object SalesforceErrorResponse {
    implicit val codec: Codec[SalesforceErrorResponse] = deriveCodec
    val expiredAuthenticationCode: String = "INVALID_SESSION_ID"
    val rateLimitExceeded: String = "REQUEST_LIMIT_EXCEEDED"
    val readOnlyMaintenance: String = "INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE"
  }

  case class SalesforceErrorResponse(
      message: String,
      errorCode: String,
  ) extends Throwable {

    val errorsToRetryUnlimited: List[String] = List(
      SalesforceErrorResponse.expiredAuthenticationCode,
      SalesforceErrorResponse.rateLimitExceeded,
      SalesforceErrorResponse.readOnlyMaintenance,
    )

    def asRetryException: RetryException = if (errorsToRetryUnlimited.contains(errorCode))
      new RetryUnlimited(message, cause = this)
    else
      new RetryNone(message, cause = this)
  }

  object SalesforceAuthenticationErrorResponse {
    implicit val codec: Codec[SalesforceAuthenticationErrorResponse] = deriveCodec
  }

  case class SalesforceAuthenticationErrorResponse(error: String, error_description: String) extends Throwable {
    override def getMessage: String = s"error: $error + error_description: $error_description"
  }

  object Authentication {
    import MillisDate.decodeDateTime
    implicit val codec: Decoder[Authentication] = deriveDecoder
  }

  case class Authentication(access_token: String, instance_url: String, issued_at: DateTime) {
    private val expiryTimeMinutes = 15

    def isFresh: Boolean = issued_at.isAfter(DateTime.now().minusMinutes(expiryTimeMinutes))
  }

  case class SfContactId(id: String)

}
