package com.gu.salesforce

import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{FlatSpec, Matchers}
import io.circe.syntax._
import io.circe.generic.auto._
import io.circe.parser._
import Fixtures._
import com.gu.salesforce.Salesforce.{NewContact, UpsertData}

class SerialisationSpec extends FlatSpec with Matchers with LazyLogging {
  "UpsertData" should "serialise to correct json" in {
    val upsertData = UpsertData(NewContact(idId, email, name, name, allowMail, allowMail, allowMail))
    upsertData.asJson should be(parse(upsertJson).right.get)
  }
}
