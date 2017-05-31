package com.gu.salesforce

import com.gu.support.workers.model.SalesforceContactRecord
import org.joda.time.DateTime
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import com.gu.zuora.encoding.CustomCodecs._
import io.circe.{Encoder, Decoder}

object Salesforce {

  implicit val salesforceContactRecordEncoder: Encoder[SalesforceContactRecord] = deriveEncoder
  implicit val salesforceContactRecordDecoder: Decoder[SalesforceContactRecord] = deriveDecoder

  object NewContact {
    implicit val encoder: Encoder[NewContact] = deriveEncoder
    implicit val decoder: Decoder[NewContact] = deriveDecoder
  }

  object UpsertData {
    implicit val encoder: Encoder[UpsertData] = deriveEncoder
    implicit val decoder: Decoder[UpsertData] = deriveDecoder

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
    val ErrorString: Option[String]
  }

  object SalesforceContactResponse {
    implicit val encoder: Encoder[SalesforceContactResponse] = deriveEncoder
    implicit val decoder: Decoder[SalesforceContactResponse] = deriveDecoder
  }

  case class SalesforceContactResponse(Success: Boolean, ErrorString: Option[String], ContactRecord: SalesforceContactRecord) extends SalesforceResponse

  object SalesforceErrorResponse {
    implicit val encoder: Encoder[SalesforceErrorResponse] = deriveEncoder
    implicit val decoder: Decoder[SalesforceErrorResponse] = deriveDecoder
  }
  case class SalesforceErrorResponse(Success: Boolean, ErrorString: Option[String]) extends Throwable with SalesforceResponse

  object Authentication {
    implicit val encoder: Encoder[Authentication] = deriveEncoder
    implicit val decoder: Decoder[Authentication] = deriveDecoder
  }
  case class Authentication(access_token: String, instance_url: String, issued_at: DateTime) {
    private val expiryTimeMinutes = 15
    def isFresh: Boolean = issued_at.isAfter(DateTime.now().minusMinutes(expiryTimeMinutes))
  }

}
