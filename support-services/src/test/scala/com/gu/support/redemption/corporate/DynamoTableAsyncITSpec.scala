package com.gu.support.redemption.corporate

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.corporate.DynamoLookup.{DynamoBoolean, DynamoString}
import com.gu.support.redemption.corporate.DynamoUpdate.DynamoFieldUpdate
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class DynamoTableAsyncITSpec extends AsyncFlatSpec with Matchers {

  val table: DynamoTableAsync = RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX)

  "lookup" should "handle all chars" in {
    val allCharsCode =
      """ITTEST- !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~"""
    table.lookup(allCharsCode).map { lookedup =>
      lookedup should be(
        Some(
          Map(
            "redemptionCode" -> DynamoString(allCharsCode),
            "available" -> DynamoBoolean(true),
            "corporateId" -> DynamoString("1"),
            "type" -> DynamoString("Corporate"),
          ),
        ),
      )
    }
  }

  "update" should "handle all chars" in {
    val allCharsMutableCode =
      """ITTEST-MUTABLE- !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~"""
    for {
      _ <- table.update(allCharsMutableCode, DynamoFieldUpdate("available", false)).map(_ should be(()))
      _ <- table.update(allCharsMutableCode, DynamoFieldUpdate("available", true)).map(_ should be(()))
      _ <- table.lookup(allCharsMutableCode).map(_.get("available") should be(DynamoBoolean(true)))
      _ <- table.update(allCharsMutableCode, DynamoFieldUpdate("available", false)).map(_ should be(()))
      a <- table.lookup(allCharsMutableCode).map(_.get("available") should be(DynamoBoolean(false)))
    } yield a
  }

}
