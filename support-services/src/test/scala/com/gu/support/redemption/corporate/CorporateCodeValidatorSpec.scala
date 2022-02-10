package com.gu.support.redemption.corporate

import com.gu.support.redemption.corporate.DynamoLookup.{DynamoBoolean, DynamoString}
import com.gu.support.redemption.corporate.CorporateCodeValidator.CorporateId
import com.gu.support.redemption.{CodeAlreadyUsed, CodeNotFound, ValidCorporateCode}
import com.gu.support.redemptions.RedemptionCode
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

class CorporateCodeValidatorSpec extends AsyncFlatSpec with Matchers {

  val testCode = "test-code-123"

  "codeValidator" should "handle an available code" in {
    val codeValidator = CorporateCodeValidator.withDynamoLookup { case `testCode` =>
      Future.successful(
        Some(
          Map(
            "available" -> DynamoBoolean(true),
            "corporateId" -> DynamoString("1"),
          ),
        ),
      )
    }
    codeValidator.getStatus(RedemptionCode(testCode).right.get).map {
      _ should be(ValidCorporateCode(CorporateId("1")))
    }
  }

  it should "handle an NON available code" in {
    val codeValidator = CorporateCodeValidator.withDynamoLookup { case `testCode` =>
      Future.successful(
        Some(
          Map(
            "available" -> DynamoBoolean(false),
            "corporateId" -> DynamoString("1"),
          ),
        ),
      )
    }
    codeValidator.getStatus(RedemptionCode(testCode).right.get).map {
      _ should be(CodeAlreadyUsed)
    }
  }

  it should "handle an NON EXISTENT code" in {
    val codeValidator = CorporateCodeValidator.withDynamoLookup { case `testCode` =>
      Future.successful(None)
    }
    codeValidator.getStatus(RedemptionCode(testCode).right.get).map {
      _ should be(CodeNotFound)
    }
  }

  it should "handle an code with invalid available type " in {
    val codeValidator = CorporateCodeValidator.withDynamoLookup { case `testCode` =>
      Future.successful(
        Some(
          Map(
            "available" -> DynamoString("haha not a boolean"),
            "corporateId" -> DynamoString("1"),
          ),
        ),
      )
    }
    recoverToSucceededIf[RuntimeException] {
      codeValidator.getStatus(RedemptionCode(testCode).right.get)
    }
  }

  it should "handle an code with invalid corporate id type " in {
    val codeValidator = CorporateCodeValidator.withDynamoLookup { case `testCode` =>
      Future.successful(
        Some(
          Map(
            "available" -> DynamoBoolean(true),
            "corporateId" -> DynamoBoolean(false),
          ),
        ),
      )
    }
    recoverToSucceededIf[RuntimeException] {
      codeValidator.getStatus(RedemptionCode(testCode).right.get)
    }
  }

  it should "handle a missing attribute code - available" in {
    val codeValidator = CorporateCodeValidator.withDynamoLookup { case `testCode` =>
      Future.successful(
        Some(
          Map(
            "asdfnqweoidnsdknfnakndaknskansdknasdaksnd" -> DynamoBoolean(true),
            "corporateId" -> DynamoString("1"),
          ),
        ),
      )
    }
    recoverToSucceededIf[RuntimeException] {
      codeValidator.getStatus(RedemptionCode(testCode).right.get)
    }
  }

  it should "handle a missing attribute code - corporate id" in {
    val codeValidator = CorporateCodeValidator.withDynamoLookup { case `testCode` =>
      Future.successful(
        Some(
          Map(
            "asdfnqweoidnsdknfnakndaknskansdknasdaksnd" -> DynamoString("1"),
            "available" -> DynamoBoolean(true),
          ),
        ),
      )
    }
    recoverToSucceededIf[RuntimeException] {
      codeValidator.getStatus(RedemptionCode(testCode).right.get)
    }
  }

  it should "be sure to fail if there is an overall dynamo failure" in {
    val codeValidator = CorporateCodeValidator.withDynamoLookup { case `testCode` =>
      Future.failed(new RuntimeException("test exception"))
    }
    recoverToSucceededIf[RuntimeException] {
      codeValidator.getStatus(RedemptionCode(testCode).right.get)
    }
  }

}
