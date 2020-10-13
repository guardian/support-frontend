package com.gu.support.workers

import com.gu.i18n.Title
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.syntax._
import io.circe.parser._
import org.joda.time.LocalDate
import com.gu.support.SerialisationTestHelpers._

class GiftRecipientSpec extends AnyFlatSpec with Matchers {

  it should "deserialise digi sub ok" in {
    val json =
      """
        |{
        |  "giftRecipientType": "DigiSub",
        |  "firstName": "bob",
        |  "lastName": "builder",
        |  "email": "bob@gu.com",
        |  "deliveryDate": "2020-10-02"
        |}
        |""".stripMargin
    val actual = decode[GiftRecipient](json)
    actual should be(Right(GiftRecipient.DigitalSubGiftRecipient("bob", "builder", "bob@gu.com", None, new LocalDate(2020, 10, 2))))
  }

  it should "deserialise weekly ok" in {
    val json =
      """
        |{
        |  "giftRecipientType": "Weekly",
        |  "firstName": "bob",
        |  "lastName": "builder"
        |}
        |""".stripMargin
    val actual = decode[GiftRecipient](json)
    actual should be(Right(GiftRecipient.WeeklyGiftRecipient(None, "bob", "builder", None)))
  }

  it should "deserialise weekly even where it's compatible with DS" in {
    val json =
      """
        |{
        |  "giftRecipientType": "Weekly",
        |  "firstName": "bob",
        |  "lastName": "builder",
        |  "email": "bob@gu.com"
        |}
        |""".stripMargin
    val actual = decode[GiftRecipient](json)
    actual should be(Right(GiftRecipient.WeeklyGiftRecipient(None, "bob", "builder", Some("bob@gu.com"))))
  }

  it should "serialise DS" in {
    val data = GiftRecipient.DigitalSubGiftRecipient("bob", "builder", "bob@gu.com", Some("message"), new LocalDate(2020, 10, 2))
    val expected =
      """
        |{
        |  "giftRecipientType": "DigiSub",
        |  "firstName": "bob",
        |  "lastName": "builder",
        |  "email": "bob@gu.com",
        |  "message": "message",
        |  "deliveryDate" : "2020-10-02"
        |}
        |""".stripMargin
    data.asJson should be(parse(expected).right.get)
  }

  it should "serialise Weekly gift" in {
    val data = GiftRecipient.WeeklyGiftRecipient(Some(Title.Mx), "bob", "builder", Some("bob@gu.com"))
    val expected =
      """
        |{
        |  "giftRecipientType": "Weekly",
        |  "title": "Mx",
        |  "firstName": "bob",
        |  "lastName": "builder",
        |  "email": "bob@gu.com"
        |}
        |""".stripMargin
    data.asJson should be(parse(expected).right.get)
  }

  it should "roundtrip ok" in {
    testRoundTripSerialisation(GiftRecipient.WeeklyGiftRecipient(Some(Title.Mx), "bob", "builder", Some("bob@gu.com")))
    testRoundTripSerialisation(GiftRecipient.DigitalSubGiftRecipient("bob", "builder", "bob@gu.com", Some("message"), new LocalDate(2020, 10, 2)))
  }

  "GiftCode" should "roundtrip ok" in {
    testRoundTripSerialisation(GiftCode("gd12-abcd2345").get)
  }
  it should "not deserialise an invalid code" in {
    val json =
      """
        |{
        |  "todo": "hi"
        |}
        |""".stripMargin
    val actual = decode[GiftCode](json)
    actual.left.map(_ => ()) should be(Left(()))
  }

  "GiftRecipientAndMaybeCode" should "roundtrip ok" in {
    testRoundTripSerialisation(
      GiftRecipientAndMaybeCode.DigitalSubGiftRecipientWithCode(
        GiftRecipient.DigitalSubGiftRecipient("bob", "builder", "bob@gu.com", Some("message"), new LocalDate(2020, 10, 2)),
        GiftCode("gd12-23456789").get
      )
    )
    testRoundTripSerialisation(
      GiftRecipientAndMaybeCode.NonDigitalSubGiftRecipient(
        GiftRecipient.WeeklyGiftRecipient(None, "bob", "builder", Some("bob@gu.com"))
      )
    )
  }

}
