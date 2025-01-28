package com.gu.support.workers

import com.gu.i18n.Title
import com.gu.support.SerialisationTestHelpers._
import io.circe.parser._
import io.circe.syntax._
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class GiftRecipientSpec extends AnyFlatSpec with Matchers {
  it should "deserialise weekly ok" in {
    val json =
      """
        |{
        |  "firstName": "bob",
        |  "lastName": "builder"
        |}
        |""".stripMargin
    val actual = decode[GiftRecipient](json)
    actual should be(Right(GiftRecipient(None, "bob", "builder", None)))
  }

  it should "serialise Weekly gift" in {
    val data = GiftRecipient(Some(Title.Mx), "bob", "builder", Some("bob@theguardian.com"))
    val expected =
      """
        |{
        |  "title": "Mx",
        |  "firstName": "bob",
        |  "lastName": "builder",
        |  "email": "bob@theguardian.com"
        |}
        |""".stripMargin
    data.asJson should be(parse(expected).right.get)
  }

  it should "roundtrip ok" in {
    testRoundTripSerialisation(
      GiftRecipient(Some(Title.Mx), "bob", "builder", Some("bob@theguardian.com")),
    )
  }

  it should "roundtrip ok via parent" in {
    testRoundTripSerialisationViaParent[GiftRecipient, GiftRecipient](
      GiftRecipient(Some(Title.Mx), "bob", "builder", Some("bob@theguardian.com")),
    )
  }

}
