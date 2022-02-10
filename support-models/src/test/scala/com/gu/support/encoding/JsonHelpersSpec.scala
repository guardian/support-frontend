package com.gu.support.encoding

import io.circe.{Json, JsonObject}

import JsonHelpers._
import io.circe.parser._
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class JsonHelpersSpec extends AsyncFlatSpec with Matchers {

  "JsonHelper" should "be able to wrap a JsonObject" in {
    val initialObject = JsonObject(("name", Json.fromString("Bill")))

    val result = initialObject.wrapObject("user")

    val json = Json.fromJsonObject(result)

    val correct =
      """
        {
          "user": {
            "name": "Bill"
            }
        }
      """

    json shouldBe parse(correct).right.get
  }
}
