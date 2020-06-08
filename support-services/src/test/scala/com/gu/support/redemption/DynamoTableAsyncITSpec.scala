package com.gu.support.redemption

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.DynamoLookup.{DynamoBoolean, DynamoString}
import com.gu.support.redemption.DynamoUpdate.DynamoFieldUpdate
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class DynamoTableAsyncITSpec extends AsyncFlatSpec with Matchers {

  val table: DynamoTableAsync = RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX)

  "lookup" should "handle all chars" in {
    val crazyCode = """ITTEST- !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~"""
    table.lookup(crazyCode).map { lookedup =>
      lookedup should be(Some(Map(
        "redemptionCode" -> DynamoString(crazyCode),
        "available" -> DynamoBoolean(true),
        "corporateId" -> DynamoString("1")
      )))
    }
  }

  "update" should "handle all chars" in {
    val crazyCode = """ITTEST-MUTABLE- !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~"""
    for {
      _ <- table.update(crazyCode, DynamoFieldUpdate("available", false)).map(_ should be(()))
      _ <- table.update(crazyCode, DynamoFieldUpdate("available", true)).map(_ should be(()))
      _ <- table.lookup(crazyCode).map(_.get("available") should be(DynamoBoolean(true)))
      _ <- table.update(crazyCode, DynamoFieldUpdate("available", false)).map(_ should be(()))
      a <- table.lookup(crazyCode).map(_.get("available") should be(DynamoBoolean(false)))
    } yield a
  }

}
