package com.gu.salesforce

import com.gu.i18n.Title
import com.gu.salesforce.Salesforce.{DeliveryContact, NewContact}

object Fixtures {
  val idId: String = "9999999"
  val salesforceId: String = "0039E000017tZVkQAM"
  val salesforceAccountId: String = "0019E00001JJ9ZMQA1"
  val emailAddress: String = "integration-test@thegulocal.com"
  val telephoneNumber: String = "0123456789"
  val title: Title = Title.Mrs
  val name: String = "integration-test"
  val street: String = "123 trash alley"
  val city: String = "London"
  val postCode: String = "n1 9gu"
  val uk: String = "UK"
  val us: String = "US"
  val state: String = "CA"
  val allowMail: Boolean = false

  val newContactUK: NewContact = NewContact(
    IdentityID__c = idId,
    Email = emailAddress,
    Salutation = Some(Title.Mrs),
    FirstName = name,
    LastName = name,
    OtherStreet = None,
    OtherCity = None,
    OtherState = None,
    OtherPostalCode = None,
    OtherCountry = uk,
    MailingStreet = None,
    MailingCity = None,
    MailingState = None,
    MailingPostalCode = None,
    MailingCountry = None,
    Phone = None,
  )
  val newContactUKWithBillingAddress: NewContact = newContactUK.copy(
    OtherStreet = Some("123 trash alley"),
    OtherCity = Some("London"),
    OtherState = None,
    OtherPostalCode = Some("n1 9gu"),
    OtherCountry = uk,
  )
  val newContactUKWithBothAddressesAndTelephone: NewContact = newContactUKWithBillingAddress.copy(
    MailingStreet = Some("123 trash alley"),
    MailingCity = Some("London"),
    MailingState = None,
    MailingPostalCode = Some("n1 9gu"),
    MailingCountry = Some(uk),
    Phone = Some(telephoneNumber),
  )
  val newContactUS: NewContact = newContactUK.copy(OtherCountry = us, OtherState = Some(state))

  val giftRecipientUpsert: DeliveryContact = DeliveryContact(
    AccountId = salesforceId,
    Email = Some(emailAddress),
    Salutation = Some(Title.Mr),
    FirstName = name,
    LastName = name,
    MailingStreet = Some(street),
    MailingCity = Some(city),
    MailingState = None,
    MailingPostalCode = Some(postCode),
    MailingCountry = Some(uk),
  )

  val upsertJson: String =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "Salutation": "Mrs",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherCountry": "$uk"
       }
      }"""
  val upsertJsonWithState: String =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "Salutation": "Mrs",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherState": "$state",
        "OtherCountry": "$us"
       }
      }"""

  val upsertJsonWithTelephoneNumber: String =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "Salutation": "Mrs",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherCountry": "$uk",
        "Phone": "$telephoneNumber"
       }
      }"""

  val upsertJsonWithBillingAddress: String =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "Salutation": "Mrs",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherStreet": "$street",
        "OtherCity": "$city",
        "OtherPostalCode": "$postCode",
        "OtherCountry": "$uk"
       }
      }"""

  val upsertJsonWithBillingAndDeliveryAddresses: String =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "Salutation": "Mrs",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherStreet": "$street",
        "OtherCity": "$city",
        "OtherPostalCode": "$postCode",
        "OtherCountry": "$uk",
        "MailingStreet": "$street",
        "MailingCity": "$city",
        "MailingPostalCode": "$postCode",
        "MailingCountry": "$uk",
        "Phone": "$telephoneNumber"
       }
      }"""

  val giftRecipientUpsertJson: String =
    s"""{
      "newContact": {
        "AccountId": "$salesforceId",
        "Email": "$emailAddress",
        "Salutation": "Mr",
        "FirstName": "$name",
        "LastName": "$name",
        "MailingStreet": "$street",
        "MailingCity": "$city",
        "MailingPostalCode": "$postCode",
        "MailingCountry": "$uk",
        "RecordTypeId": "01220000000VB50AAG"
       }
      }"""

  val authJson: String =
    """
      {
        "access_token": "00Dg0000006RDAM!AREAQKDFKQ.ZPdIxWp4Z55tyVgs0D_kPhaiCMndEOk7WVB8yRffLVNK9TFbtZk34cWAfaaeojHL2ndURQounCzhRfBE_nMct",
        "instance_url": "https://cs17.salesforce.com",
        "id": "https://test.salesforce.com/id/00Dg0000006RDAMEA4/00520000003DLCDAA4",
        "token_type": "Bearer",
        "issued_at": "%d",
        "signature": "UK0fYmoyyuefxqsXFnovXy/RM/MleImPqZcf72ax+As="
      }
    """

  val expiredTokenResponse: String =
    """
      [{"message":"Session expired or invalid","errorCode":"INVALID_SESSION_ID"}]
    """

  val authenticationErrorResponse: String =
    """
      400: {"error":"invalid_client_id","error_description":"client identifier invalid"}
    """
}
