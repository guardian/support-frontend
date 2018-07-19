package com.gu.emailservices

import io.circe.{Json, Printer}

trait EmailFields {

  val fields: List[(String, String)]

  def payload(dataExtensionName: String): String

  protected def payload(email: String, dataExtensionName: String): String =
    s"""
       |{
       |  "To": {
       |    "Address": "$email",
       |    "SubscriberKey": "$email",
       |    "ContactAttributes": {
       |      "SubscriberAttributes": $fieldsAsJson
       |    }
       |  },
       |  "DataExtensionName": "$dataExtensionName"
       |}
    """.stripMargin

  protected def fieldsAsJson = Json
    .fromFields(fields.map { case (k: String, v: String) => (k, Json.fromString(v)) })
    .pretty(Printer.spaces2)
  protected def mask(s: String): String = s.replace(s.substring(0, 6), "******")
  protected def hyphenate(s: String): String = s"${s.substring(0, 2)}-${s.substring(2, 4)}-${s.substring(4, 6)}"
}
