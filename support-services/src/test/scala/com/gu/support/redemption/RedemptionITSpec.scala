package com.gu.support.redemption

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.GetCodeStatus.{CodeAlreadyUsed, NoSuchCode}
import com.gu.support.redemption.Redemption.RedemptionCode
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class RedemptionITSpec extends AsyncFlatSpec with Matchers {

  val getCodeStatus: GetCodeStatus =
    GetCodeStatus.withDynamoLookup(RedemptionTableAsync.forEnv(TouchPointEnvironments.SANDBOX))

  "getCodeStatus" should "handle an available code" in {
    getCodeStatus(RedemptionCode("ITTEST-AVAILABLE")).map {
      _ should be(Right(()))
    }
  }

  it should "handle an NOT available code" in {
    getCodeStatus(RedemptionCode("ITTEST-USED")).map {
      _ should be(Left(CodeAlreadyUsed))
    }
  }

  it should "handle an NOT valid code" in {
    getCodeStatus(RedemptionCode("ITTEST-MISSING")).map {
      _ should be(Left(NoSuchCode))
    }
  }

}
