package com.gu.salesforce

object Salesforce {

  object UpsertData {
    def create(identityId: String, email: String, firstName: String,
               lastName: String,
               allowMembershipMail: Boolean,
               allow3rdPartyMail: Boolean,
               allowGuardianRelatedMail: Boolean) =
      UpsertData(
        NewContact(
          identityId, email, firstName, lastName, allowMembershipMail, allow3rdPartyMail, allowGuardianRelatedMail
        )
      )
  }

  //The odd field names on these class are to match with the Salesforce api and allow us to serialise and deserialise
  //without a lot of custom mapping code
  case class UpsertData(newContact: NewContact)

  case class NewContact(IdentityID__c: String, Email: String, FirstName: String,
                        LastName: String,
                        Allow_Membership_Mail__c: Boolean,
                        Allow_3rd_Party_Mail__c: Boolean,
                        Allow_Guardian_Related_Mail__c: Boolean)

  trait SalesforceResponse {
    val Success: Boolean
    val ErrorString: Option[String]
  }

  case class SalesforceContactRecord(Id: String, AccountId: String)

  case class SalesforceContactResponse(Success: Boolean, ErrorString: Option[String], ContactRecord: SalesforceContactRecord) extends SalesforceResponse

  case class SalesforceErrorResponse(Success: Boolean, ErrorString: Option[String]) extends Throwable with SalesforceResponse

  case class Authentication(access_token: String, instance_url: String)

}
