package com.gu.salesforce

import com.gu.salesforce.Salesforce.NewContact

object Fixtures {
  val idId = "9999999"
  val salesforceId = "0036E00000Uc1IhQAJ"
  val emailAddress = "yjcysqxfcqqytuzupjc@gu.com"
  val telephoneNumber = "0123456789"
  val name = "YJCysqXFCqqYtuzuPJc"
  val street = "123 trash alley"
  val city = "London"
  val postCode = "n1 9gu"
  val uk = "UK"
  val us = "US"
  val state = "CA"
  val allowMail = false

  val newContactUK = NewContact(idId, emailAddress, name, name, None, None, None, None, uk, None, None, None, None, None, None, allowMail, allowMail, allowMail)
  val newContactUKWithBillingAddress = newContactUK.copy(
    OtherStreet = Some("123 trash alley"),
    OtherCity = Some("London"),
    OtherState = None,
    OtherPostalCode = Some("n1 9gu"),
    OtherCountry = uk
  )
  val newContactUKWithBothAddressesAndTelephone = newContactUKWithBillingAddress.copy(
    MailingStreet = Some("123 trash alley"),
    MailingCity = Some("London"),
    MailingState = None,
    MailingPostalCode = Some("n1 9gu"),
    MailingCountry = Some(uk),
    Phone = Some(telephoneNumber)
  )
  val newContactUS = newContactUK.copy(OtherCountry = us, OtherState = Some(state))


  val upsertJson =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherCountry": "$uk",
        "Allow_Membership_Mail__c": $allowMail,
        "Allow_3rd_Party_Mail__c": $allowMail,
        "Allow_Guardian_Related_Mail__c": $allowMail
       }
      }"""
  val upsertJsonWithState =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherState": "$state",
        "OtherCountry": "$us",
        "Allow_Membership_Mail__c": $allowMail,
        "Allow_3rd_Party_Mail__c": $allowMail,
        "Allow_Guardian_Related_Mail__c": $allowMail
       }
      }"""

  val upsertJsonWithTelephoneNumber =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherCountry": "$uk",
        "Phone": "$telephoneNumber",
        "Allow_Membership_Mail__c": $allowMail,
        "Allow_3rd_Party_Mail__c": $allowMail,
        "Allow_Guardian_Related_Mail__c": $allowMail
       }
      }"""

  val upsertJsonWithBillingAddress =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
        "FirstName": "$name",
        "LastName": "$name",
        "OtherStreet": "$street",
        "OtherCity": "$city",
        "OtherPostalCode": "$postCode",
        "OtherCountry": "$uk",
        "Allow_Membership_Mail__c": $allowMail,
        "Allow_3rd_Party_Mail__c": $allowMail,
        "Allow_Guardian_Related_Mail__c": $allowMail
       }
      }"""

  val upsertJsonWithBillingAndDeliveryAddresses =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
        "Email": "$emailAddress",
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
        "Phone": "$telephoneNumber",
        "Allow_Membership_Mail__c": $allowMail,
        "Allow_3rd_Party_Mail__c": $allowMail,
        "Allow_Guardian_Related_Mail__c": $allowMail
       }
      }"""

  val authJson =
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

  val expiredTokenResponse =
    """
      [{"message":"Session expired or invalid","errorCode":"INVALID_SESSION_ID"}]
    """

  val authenticationErrorResponse =
    """
      400: {"error":"invalid_client_id","error_description":"client identifier invalid"}
    """
}
