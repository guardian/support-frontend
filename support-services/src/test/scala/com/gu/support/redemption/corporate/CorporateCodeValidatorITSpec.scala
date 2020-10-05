package com.gu.support.redemption.corporate

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.corporate.CorporateCodeValidator.CorporateId
import com.gu.support.redemption.{CodeAlreadyUsed, CodeNotFound, ValidCorporateCode}
import com.gu.support.redemptions.RedemptionCode
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class CorporateCodeValidatorITSpec extends AsyncFlatSpec with Matchers {

  val codeValidator: CorporateCodeValidator =
    CorporateCodeValidator.withDynamoLookup(RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX))

  "codeValidator" should "handle an available code" in {
    codeValidator.getStatus(RedemptionCode("it-available1").right.get).map {
      _ should be(ValidCorporateCode(CorporateId("1")))
    }
  }

  it should "handle an NOT available code" in {
    codeValidator.getStatus(RedemptionCode("it-test-used1").right.get).map {
      _ should be(CodeAlreadyUsed)
    }
  }

  it should "handle an NOT valid code" in {
    codeValidator.getStatus(RedemptionCode("it-missing123").right.get).map {
      _ should be(CodeNotFound)
    }
  }

}
