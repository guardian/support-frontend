package com.gu.salesforce

object Fixtures {
  val idId = "30000264"
  val salesforceId = "003g000001UnFItAAN"
  val email = "6cwdm8aler7z9r6nwbc@gu.com"
  val name = "6cWdM8AlER7z9R6nWBc"
  val allowMail = false
  val upsertJson =
    s"""{
      "newContact": {
        "IdentityID__c": "$idId",
         "Email": "$email",
         "FirstName": "$name",
         "LastName": "$name",
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
