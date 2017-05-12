package com.gu.salesforce

import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{ Authentication, NewContact, UpsertData }
import com.gu.zuora.encoding.CustomCodecs
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import org.joda.time.DateTime
import org.scalatest.{ FlatSpec, Matchers }

class SerialisationSpec extends FlatSpec with Matchers with LazyLogging with CustomCodecs {
  "UpsertData" should "serialise to correct json" in {
    val upsertData = UpsertData(NewContact(idId, email, name, name, allowMail, allowMail, allowMail))
    upsertData.asJson should be(parse(upsertJson).right.get)
  }

  "Authentication" should "deserialize correctly" in {
    val now = DateTime.now()
    val stale = DateTime.parse("1971-02-20")

    //Deserialize a fresh token
    val decodeResult = decode[Authentication](authJson.format(now.getMillis)) //issued_at time is in millis
    decodeResult.isRight should be(true)
    decodeResult.right.get.isStale should be(false)

    //Deserialize a stale token
    val decodeResult2 = decode[Authentication](authJson.format(stale.getMillis))
    decodeResult2.isRight should be(true)
    decodeResult2.right.get.isStale should be(true)
  }
}
