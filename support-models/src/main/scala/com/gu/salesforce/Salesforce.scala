package com.gu.salesforce

import cats.syntax.functor._
import com.gu.i18n.Title
import com.gu.salesforce.Salesforce.SalesforceErrorResponse.{expiredAuthenticationCode, rateLimitExceeded}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.encoding.JsonHelpers.JsonObjectExtensions
import com.gu.support.workers.SalesforceContactRecord
import com.gu.support.workers.exceptions.{RetryException, RetryNone, RetryUnlimited}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}
import org.joda.time.DateTime

object Salesforce {

  type RecordTypeId = String

  object RecordType {
    val deliveryRecipientContactId: RecordTypeId = "01220000000VB50AAG"
    val standardCustomerId: RecordTypeId = "01220000000VB52AAG"
  }

  implicit val salesforceContactRecordCodec: Codec[SalesforceContactRecord] = deriveCodec

  object NewContact {
    implicit val decoder: Decoder[NewContact] = deriveDecoder
    implicit val encoder: Encoder[NewContact] = deriveEncoder[NewContact].mapJsonObject(_.wrapObject("newContact"))
  }

  object DeliveryContact {
    implicit val decoder: Decoder[DeliveryContact] = deriveDecoder
    implicit val encoder: Encoder[DeliveryContact] = deriveEncoder[DeliveryContact].mapJsonObject(_.wrapObject("newContact"))
  }

  //The odd field names on these class are to match with the Salesforce api and allow us to serialise and deserialise
  //without a lot of custom mapping code

  sealed trait UpsertData

  object UpsertData {
    implicit val encoder: Encoder[UpsertData] = Encoder.instance {
      case newContact: NewContact => newContact.asJson
      case deliveryContact: DeliveryContact => deliveryContact.asJson
    }

    implicit val decodeProduct: Decoder[UpsertData] =
      List[Decoder[UpsertData]](
        Decoder[NewContact].widen,
        Decoder[DeliveryContact].widen
      ).reduceLeft(_ or _)
  }

  case class NewContact(
    IdentityID__c: String,
    Email: String,
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
    Allow_Membership_Mail__c: Boolean,
    Allow_3rd_Party_Mail__c: Boolean,
    Allow_Guardian_Related_Mail__c: Boolean
  ) extends UpsertData

  case class DeliveryContact(
    AccountId: String,
    RecordTypeId: RecordTypeId,
    Email: Option[String],
    Title: Option[Title],
    FirstName: String,
    LastName: String,
    MailingStreet: Option[String],
    MailingCity: Option[String],
    MailingState: Option[String],
    MailingPostalCode: Option[String],
    MailingCountry: Option[String],
  ) extends UpsertData

  trait SalesforceResponse {
    val Success: Boolean
  }

  object SalesforceContactResponse {
    implicit val codec: Codec[SalesforceContactResponse] = deriveCodec
  }

  object SalesforceContactRecords {
    implicit val codec: Codec[SalesforceContactRecords] = deriveCodec
  }

  case class SalesforceContactResponse(Success: Boolean, ErrorString: Option[String], ContactRecord: SalesforceContactRecord) extends SalesforceResponse

  case class SalesforceContactRecords(buyer: SalesforceContactRecord, giftRecipient: Option[SalesforceContactRecord])

  case class SalesforceContactRecordsResponse(buyer: SalesforceContactResponse, giftRecipient: Option[SalesforceContactResponse]) {
    def successful: Boolean = buyer.Success && giftRecipient.forall(_.Success)

    def errorMessage: Option[String] = List(buyer.ErrorString, giftRecipient.flatMap(_.ErrorString)).flatten.headOption

    def contactRecords = SalesforceContactRecords(buyer.ContactRecord, giftRecipient.map(_.ContactRecord))
  }

  object SalesforceErrorResponse {
    implicit val codec: Codec[SalesforceErrorResponse] = deriveCodec
    val expiredAuthenticationCode = "INVALID_SESSION_ID"
    val rateLimitExceeded = "REQUEST_LIMIT_EXCEEDED"
  }

  case class SalesforceErrorResponse(message: String, errorCode: String) extends Throwable {
    def asRetryException: RetryException = if (errorCode == expiredAuthenticationCode || errorCode == rateLimitExceeded)
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
    implicit val codec: Codec[Authentication] = deriveCodec
  }

  case class Authentication(access_token: String, instance_url: String, issued_at: DateTime) {
    private val expiryTimeMinutes = 15

    def isFresh: Boolean = issued_at.isAfter(DateTime.now().minusMinutes(expiryTimeMinutes))
  }

  case class SfContactId(id: String)

}
