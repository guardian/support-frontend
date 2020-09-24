package com.gu.emailservices

import com.gu.emailservices.DigitalPackEmailFields.Failable
import com.gu.emailservices.DigitalSubscriptionEmailAttributes.PaymentFieldsAttributes.PPAttributes
import com.gu.emailservices.DigitalSubscriptionEmailAttributes.{BasicDSAttributes, DirectDSAttributes}
import io.circe.Json.{JArray, JObject}
import io.circe.{Json, JsonObject}
import io.circe.syntax._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.EitherValues._

class DigitalPackEmailFieldsSpec extends AnyFlatSpec with Matchers {

  "asFlattenedPairs" should "handle a real object" in {
    val data = DirectDSAttributes(
      directCorp = BasicDSAttributes(
        zuorasubscriberid = "1",
        emailaddress = "2",
        first_name = "3",
        last_name = "4",
        subscription_details = "5"
      ),
      subscription_term = "6",
      payment_amount = "7",
      country = "8",
      date_of_first_payment = "9",
      currency = "0",
      trial_period = "a",
      paymentFieldsAttributes = PPAttributes()
    ).asJsonObject
    val actual = DigitalPackEmailFields.asFlattenedPairs(data)
    actual.map(_.toMap) should be(Right(Map(
      "zuorasubscriberid" -> "1",
      "emailaddress" -> "2",
      "first_name" -> "3",
      "last_name" -> "4",
      "subscription_details" -> "5",
      "subscription_term" -> "6",
      "payment_amount" -> "7",
      "country" -> "8",
      "date_of_first_payment" -> "9",
      "currency" -> "0",
      "trial_period" -> "a",
      "default_payment_method" -> "PayPal",
    )))
  }

  it should "fail if there are any top level non string" in {
    val data = JsonObject(
      "test" -> Json.arr()
    )
    val actual = DigitalPackEmailFields.asFlattenedPairs(data)
    actual.map(_.toMap) should matchPattern { case Left(_) => }
  }

  it should "fail if there are any non string lower down" in {
    val data = JsonObject(
      "test1" -> Json.obj(
      "test2" -> Json.arr()
      )
    )
    val actual = DigitalPackEmailFields.asFlattenedPairs(data)
    actual.map(_.toMap) should matchPattern { case Left(_) => }
  }

  it should "merge a valid nested" in {
    val data = JsonObject(
      ("shouldExist1" -> Json.fromString("value1")),
      "test" -> Json.obj(
        ("shouldExist2" -> Json.fromString("value2"))
      )
    )
    val actual = DigitalPackEmailFields.asFlattenedPairs(data)
    actual.map(_.toMap) should be(Right(Map(
      "shouldExist1" -> "value1",
      "shouldExist2" -> "value2",
    )))
  }

  it should "complain about a key clash" in {
    val data = JsonObject(
      ("clash" -> Json.fromString("value1")),
      "test" -> Json.obj(
        ("clash" -> Json.fromString("value2"))
      )
    )
    val actual = DigitalPackEmailFields.asFlattenedPairs(data)
    actual.map(_.toMap) should matchPattern { case Left(_) => }
  }

}
