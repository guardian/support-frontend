package com.gu.salesforce

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.gu.support.workers.model.SalesforceContactRecord
import com.gu.zuora.encoding.CustomCodecs._
import org.joda.time.DateTime

object Salesforce {

  implicit val salesforceContactRecordCodec: Codec[SalesforceContactRecord] = deriveCodec

  object NewContact {
    implicit val codec: Codec[NewContact] = deriveCodec
  }

  object UpsertData {
    implicit val codec: Codec[UpsertData] = deriveCodec

    def create(
      identityId: String,
      email: String,
      firstName: String,
      lastName: String,
      allowMembershipMail: Boolean,
      allow3rdPartyMail: Boolean,
      allowGuardianRelatedMail: Boolean
    ): UpsertData =
      UpsertData(
        NewContact(
          identityId, email, firstName, lastName, allowMembershipMail, allow3rdPartyMail, allowGuardianRelatedMail
        )
      )
  }

  //The odd field names on these class are to match with the Salesforce api and allow us to serialise and deserialise
  //without a lot of custom mapping code
  case class UpsertData(newContact: NewContact)

  case class NewContact(
    IdentityID__c: String,
    Email: String,
    FirstName: String,
    LastName: String,
    Allow_Membership_Mail__c: Boolean,
    Allow_3rd_Party_Mail__c: Boolean,
    Allow_Guardian_Related_Mail__c: Boolean
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
  }
  case class SalesforceErrorResponse(message: String, errorCode: String) extends Throwable

  object SalesforceAuthenticationErrorResponse {
    implicit val codec: Codec[SalesforceAuthenticationErrorResponse] = deriveCodec
  }
  case class SalesforceAuthenticationErrorResponse(error: String, error_description: String) extends Throwable

  object Authentication {
    implicit val codec: Codec[Authentication] = deriveCodec
  }
  case class Authentication(access_token: String, instance_url: String, issued_at: DateTime) {
    private val expiryTimeMinutes = 15
    def isFresh: Boolean = issued_at.isAfter(DateTime.now().minusMinutes(expiryTimeMinutes))
  }

}
