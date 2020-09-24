package com.gu.support.redemption.corporate

import com.gu.support.redemption.corporate.DynamoLookup.{DynamoBoolean, DynamoString}
import com.gu.support.redemption.corporate.GetCodeStatus.{CodeAlreadyUsed, CorporateId, NoSuchCode}
import com.gu.support.redemptions.RedemptionCode
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

class GetCodeStatusSpec extends AsyncFlatSpec with Matchers {

  "getCodeStatus" should "handle an available code" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map(
        "available" -> DynamoBoolean(true),
        "corporateId" -> DynamoString("1")
      )))
    }
    getCodeStatus(RedemptionCode("CODE").right.get).map {
      _ should be(Right(CorporateId("1")))
    }
  }

  it should "handle an NON available code" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map(
        "available" -> DynamoBoolean(false),
        "corporateId" -> DynamoString("1")
      )))
    }
    getCodeStatus(RedemptionCode("CODE").right.get).map {
      _ should be(Left(CodeAlreadyUsed))
    }
  }

  it should "handle an NON EXISTENT code" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(None)
    }
    getCodeStatus(RedemptionCode("CODE").right.get).map {
      _ should be(Left(NoSuchCode))
    }
  }

  it should "handle an code with invalid available type " in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map(
        "available" -> DynamoString("haha not a boolean"),
        "corporateId" -> DynamoString("1")
      )))
    }
    recoverToSucceededIf[RuntimeException] {
      getCodeStatus(RedemptionCode("CODE").right.get)
    }
  }

  it should "handle an code with invalid corporate id type " in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map(
        "available" -> DynamoBoolean(true),
        "corporateId" -> DynamoBoolean(false)
      )))
    }
    recoverToSucceededIf[RuntimeException] {
      getCodeStatus(RedemptionCode("CODE").right.get)
    }
  }

  it should "handle a missing attribute code - available" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map(
        "ASDFNQWEOIDNSDKNFNAKNDAKNSKANSDKNASDAKSND" -> DynamoBoolean(true),
        "corporateId" -> DynamoString("1")
      )))
    }
    recoverToSucceededIf[RuntimeException] {
      getCodeStatus(RedemptionCode("CODE").right.get)
    }
  }

  it should "handle a missing attribute code - corporate id" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map(
        "ASDFNQWEOIDNSDKNFNAKNDAKNSKANSDKNASDAKSND" -> DynamoString("1"),
        "available" -> DynamoBoolean(true)
      )))
    }
    recoverToSucceededIf[RuntimeException] {
      getCodeStatus(RedemptionCode("CODE").right.get)
    }
  }

  it should "be sure to fail if there is an overall dynamo failure" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.failed(new RuntimeException("test exception"))
    }
    recoverToSucceededIf[RuntimeException] {
      getCodeStatus(RedemptionCode("CODE").right.get)
    }
  }

}
