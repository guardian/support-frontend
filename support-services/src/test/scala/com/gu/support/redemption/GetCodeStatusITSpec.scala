package com.gu.support.redemption

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.GetCodeStatus.{CodeAlreadyUsed, CorporateId, NoSuchCode}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class GetCodeStatusITSpec extends AsyncFlatSpec with Matchers {

  val getCodeStatus: GetCodeStatus =
    GetCodeStatus.withDynamoLookup(RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX))

  "getCodeStatus" should "handle an available code" in {
    getCodeStatus(RedemptionCode("ITTEST-AVAILABLE").right.get).map {
      _ should be(Right(CorporateId("1")))
    }
  }

  it should "handle an NOT available code" in {
    getCodeStatus(RedemptionCode("ITTEST-USED").right.get).map {
      _ should be(Left(CodeAlreadyUsed))
    }
  }

  it should "handle an NOT valid code" in {
    getCodeStatus(RedemptionCode("ITTEST-MISSING").right.get).map {
      _ should be(Left(NoSuchCode))
    }
  }

}
