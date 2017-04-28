package com.gu.salesforce

import com.gu.salesforce.ContactDeserializer.Keys
import play.api.libs.json.Json

object Fixtures {
  val idId = "30000264"
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

  val jsObject = Json.obj(
    Keys.EMAIL -> email,
    Keys.FIRST_NAME -> name,
    Keys.LAST_NAME -> name,
    Keys.ALLOW_MEMBERSHIP_MAIL -> allowMail,
    Keys.ALLOW_THIRD_PARTY_EMAIL -> allowMail,
    Keys.ALLOW_GU_RELATED_MAIL -> allowMail
  )
}
