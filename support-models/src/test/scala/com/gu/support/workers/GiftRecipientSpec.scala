package com.gu.support.workers

import com.gu.i18n.Title
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.syntax._
import io.circe.parser._
import org.joda.time.LocalDate

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

}
