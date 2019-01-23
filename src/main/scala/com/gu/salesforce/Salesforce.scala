package com.gu.salesforce

import com.gu.salesforce.Salesforce.SalesforceErrorResponse._
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs.{decodeDateTime, encodeDateTime}
import com.gu.support.workers.SalesforceContactRecord
import com.gu.support.workers.exceptions.{RetryException, RetryNone, RetryUnlimited}
import org.joda.time.DateTime

object Salesforce {

  implicit val salesforceContactRecordCodec: Codec[SalesforceContactRecord] = deriveCodec

  object NewContact {
    implicit val codec: Codec[NewContact] = deriveCodec
  }

  object UpsertData {
    implicit val codec: Codec[UpsertData] = deriveCodec

    // scalastyle:off parameter.number
    def create(
      identityId: String,
      email: String,
      firstName: String,
      lastName: String,
      mailingState: Option[String],
      mailingCountry: String,
      allowMembershipMail: Boolean,
      allow3rdPartyMail: Boolean,
      allowGuardianRelatedMail: Boolean,
      telephoneNumber: Option[String]
    ): UpsertData =
      UpsertData(
        NewContact(
          identityId,
          email,
          firstName,
          lastName,
          mailingState,
          mailingCountry,
          allowMembershipMail,
          allow3rdPartyMail,
          allowGuardianRelatedMail,
          telephoneNumber
        )
      )
    // scalastyle:on parameter.number
  }

  //The odd field names on these class are to match with the Salesforce api and allow us to serialise and deserialise
  //without a lot of custom mapping code
  case class UpsertData(newContact: NewContact)

  case class NewContact(
    IdentityID__c: String,
    Email: String,
    FirstName: String,
    LastName: String,
    MailingState: Option[String],
    MailingCountry: String,
    Allow_Membership_Mail__c: Boolean,
    Allow_3rd_Party_Mail__c: Boolean,
    Allow_Guardian_Related_Mail__c: Boolean,
    Department: Option[String]
  )

  trait SalesforceResponse {
    val Success: Boolean
  }

  object SalesforceContactResponse {
    implicit val codec: Codec[SalesforceContactResponse] = deriveCodec
  }

  case class SalesforceContactResponse(Success: Boolean, ErrorString: Option[String], ContactRecord: SalesforceContactRecord) extends SalesforceResponse

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
