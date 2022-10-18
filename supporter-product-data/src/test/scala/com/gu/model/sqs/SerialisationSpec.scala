package com.gu.model.sqs

import com.gu.Fixtures
import io.circe.parser.decode
import org.scalatest.EitherValues._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SerialisationSpec extends AnyFlatSpec with Matchers {

  "SupporterRatePlanItem" should "deserialise correctly" in {
    val result = decode[SqsEvent](Fixtures.sqsEventJson)
    result.right.value.Records.length shouldBe 1
    result.right.value.Records.head.body shouldBe "Hello World"
  }

}
