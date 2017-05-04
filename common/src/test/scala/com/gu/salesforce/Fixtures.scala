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
}
