package com.gu.emailservices

import io.circe._
import io.circe.parser._
import org.scalatest.{FlatSpec, Matchers}

class EmailFieldsSpec extends FlatSpec with Matchers {
  "EmailPayload" should "serialize to json" in {
    val Right(expectedJson) = parse(
      s"""
         |{
         |  "To": {
         |    "Address": "email@email.com",
         |    "SubscriberKey": "email@email.com",
         |    "ContactAttributes": {
         |      "SubscriberAttributes": { "attribute1" : "value1" ,  "attribute2" : "value2" }
         |    }
         |  },
         |  "DataExtensionName": "dataExtensionName",
         |  "SfContactId": "sfContactId",
         |  "IdentityUserId": "identityUserId"
         |}
      """.stripMargin
    )

    val Right(serializedJson) = parse(
      EmailPayload(
        EmailPayloadTo(
          "email@email.com",
          "email@email.com",
          EmailPayloadContactAttributes(
            Map("attribute1" -> "value1", "attribute2" -> "value2")
          )
        ),
        "dataExtensionName",
        Some("sfContactId"),
        Some("identityUserId")
      ).jsonString
    )

    serializedJson shouldBe expectedJson
  }
}
