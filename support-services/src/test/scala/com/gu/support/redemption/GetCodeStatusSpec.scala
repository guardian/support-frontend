package com.gu.support.redemption

import com.amazonaws.services.dynamodbv2.model.AttributeValue
import com.gu.support.redemption.GetCodeStatus.{CodeAlreadyUsed, NoSuchCode}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

class GetCodeStatusSpec extends AsyncFlatSpec with Matchers {

  "getCodeStatus" should "handle an available code" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map("available" -> new AttributeValue().withBOOL(true))))
    }
    getCodeStatus(RedemptionCode("CODE")).map {
      _ should be(Right(()))
    }
  }

  it should "handle an available code with extra attributes lying around" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map(
        "available" -> new AttributeValue().withBOOL(true),
        "otherFields" -> new AttributeValue().withS("Hello!")
      )))
    }
    getCodeStatus(RedemptionCode("CODE")).map {
      _ should be(Right(()))
    }
  }

  it should "handle an NON available code" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map("available" -> new AttributeValue().withBOOL(false))))
    }
    getCodeStatus(RedemptionCode("CODE")).map {
      _ should be(Left(CodeAlreadyUsed))
    }
  }

  it should "handle an NON EXISTENT code" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(None)
    }
    getCodeStatus(RedemptionCode("CODE")).map {
      _ should be(Left(NoSuchCode))
    }
  }

  it should "handle an code with invalid attrbibute type " in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map("available" -> new AttributeValue().withS("true"))))
    }
    recoverToSucceededIf[RuntimeException] {
      getCodeStatus(RedemptionCode("CODE"))
    }
  }

  it should "handle an  missing arrtibute code" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.successful(Some(Map("ASDFNQWEOIDNSDKNFNAKNDAKNSKANSDKNASDAKSND" -> new AttributeValue().withBOOL(true))))
    }
    recoverToSucceededIf[RuntimeException] {
      getCodeStatus(RedemptionCode("CODE"))
    }
  }

  it should "be sure to fail if there is an overall dynamo failure" in {
    val getCodeStatus = GetCodeStatus.withDynamoLookup {
      case "CODE" => Future.failed(new RuntimeException("test exception"))
    }
    recoverToSucceededIf[RuntimeException] {
      getCodeStatus(RedemptionCode("CODE"))
    }
  }

}
