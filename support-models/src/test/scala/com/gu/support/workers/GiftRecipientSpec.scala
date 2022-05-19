package com.gu.support.workers

import com.gu.i18n.Title
import com.gu.support.SerialisationTestHelpers._
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import io.circe.parser._
import io.circe.syntax._
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class GiftRecipientSpec extends AnyFlatSpec with Matchers {

  it should "deserialise digi sub ok" in {
    val json =
      """
        |{
        |  "giftRecipientType": "DigitalSubscription",
        |  "firstName": "bob",
        |  "lastName": "builder",
        |  "email": "bob@theguardian.com",
        |  "deliveryDate": "2020-10-02"
        |}
        |""".stripMargin
    val actual = decode[GiftRecipient](json)
    actual should be(
      Right(
        GiftRecipient.DigitalSubscriptionGiftRecipient("bob", "builder", "bob@theguardian.com", None, new LocalDate(2020, 10, 2)),
      ),
    )
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
        |  "email": "bob@theguardian.com"
        |}
        |""".stripMargin
    val actual = decode[GiftRecipient](json)
    actual should be(Right(GiftRecipient.WeeklyGiftRecipient(None, "bob", "builder", Some("bob@theguardian.com"))))
  }

  it should "serialise DS" in {
    val data = GiftRecipient.DigitalSubscriptionGiftRecipient(
      "bob",
      "builder",
      "bob@gu.com",
      Some("message"),
      new LocalDate(2020, 10, 2),
    )
    val expected =
      """
        |{
        |  "giftRecipientType": "DigitalSubscription",
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
    val data = GiftRecipient.WeeklyGiftRecipient(Some(Title.Mx), "bob", "builder", Some("bob@theguardian.com"))
    val expected =
      """
        |{
        |  "giftRecipientType": "Weekly",
        |  "title": "Mx",
        |  "firstName": "bob",
        |  "lastName": "builder",
        |  "email": "bob@theguardian.com"
        |}
        |""".stripMargin
    data.asJson should be(parse(expected).right.get)
  }

  it should "roundtrip ok" in {
    testRoundTripSerialisation(GiftRecipient.WeeklyGiftRecipient(Some(Title.Mx), "bob", "builder", Some("bob@theguardian.com")))
    testRoundTripSerialisation(
      GiftRecipient.DigitalSubscriptionGiftRecipient(
        "bob",
        "builder",
        "bob@gu.com",
        Some("message"),
        new LocalDate(2020, 10, 2),
      ),
    )
  }

  it should "roundtrip ok via parent" in {
    testRoundTripSerialisationViaParent[GiftRecipient, WeeklyGiftRecipient](
      WeeklyGiftRecipient(Some(Title.Mx), "bob", "builder", Some("bob@theguardian.com")),
    )
    testRoundTripSerialisationViaParent[GiftRecipient, DigitalSubscriptionGiftRecipient](
      DigitalSubscriptionGiftRecipient("bob", "builder", "bob@gu.com", Some("message"), new LocalDate(2020, 10, 2)),
    )
  }

  "GiftCode" should "roundtrip ok" in {
    testRoundTripSerialisation(GeneratedGiftCode("gd12-abcd2345").get)
  }
  it should "not deserialise an invalid code" in {
    val json =
      """
        |{
        |  "todo": "hi"
        |}
        |""".stripMargin
    val actual = decode[GeneratedGiftCode](json)
    actual.left.map(_ => ()) should be(Left(()))
  }

}
