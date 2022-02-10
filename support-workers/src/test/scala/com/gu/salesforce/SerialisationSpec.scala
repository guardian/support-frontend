package com.gu.salesforce

import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{Authentication, NewContact, UpsertData}
import com.typesafe.scalalogging.LazyLogging
import io.circe.Printer
import io.circe.parser._
import io.circe.syntax._
import org.joda.time.DateTime
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SerialisationSpec extends AnyFlatSpec with Matchers with LazyLogging {

  "UpsertData" should "serialise to correct UK json" in {
    newContactUK.asJson.printWith(Printer.noSpaces.copy(dropNullValues = true)) should be(
      parse(upsertJson).toOption.get.noSpaces,
    )
  }

  "UpsertData" should "serialise to correct US json" in {
    newContactUS.asJson.printWith(Printer.noSpaces.copy(dropNullValues = true)) should be(
      parse(upsertJsonWithState).toOption.get.noSpaces,
    )
  }

  "UpsertData" should "serialise to correct json when telephoneNumber provided" in {
    val newContactWithTelephone = newContactUK.copy(Phone = Some(telephoneNumber))
    newContactWithTelephone.asJson.printWith(Printer.noSpaces.copy(dropNullValues = true)) should be(
      parse(upsertJsonWithTelephoneNumber).toOption.get.noSpaces,
    )
  }

  "UpsertData" should "serialise to correct json when billing address provided" in {
    newContactUKWithBillingAddress.asJson.printWith(Printer.noSpaces.copy(dropNullValues = true)) should be(
      parse(upsertJsonWithBillingAddress).toOption.get.noSpaces,
    )
  }

  "UpsertData" should "serialise to correct json when billing address and delivery address provided" in {
    newContactUKWithBothAddressesAndTelephone.asJson.printWith(Printer.noSpaces.copy(dropNullValues = true)) should be(
      parse(upsertJsonWithBillingAndDeliveryAddresses).toOption.get.noSpaces,
    )
  }

  "Gift recipient upsert data" should "serialise to correct json" in {
    giftRecipientUpsert.asJson.printWith(Printer.noSpaces.copy(dropNullValues = true)) should be(
      parse(giftRecipientUpsertJson).toOption.get.noSpaces,
    )
  }

  "Authentication" should "deserialize correctly" in {
    val now = DateTime.now()
    val stale = DateTime.parse("1971-02-20")

    // Deserialize a fresh token
    val decodeResult = decode[Authentication](authJson.format(now.getMillis)) // issued_at time is in millis
    decodeResult.isRight should be(true)
    decodeResult.toOption.get.isFresh should be(true)

    // Deserialize a stale token
    val decodeResult2 = decode[Authentication](authJson.format(stale.getMillis))
    decodeResult2.isRight should be(true)
    decodeResult2.toOption.get.isFresh should be(false)
  }
}
