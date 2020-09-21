package com.gu.support.redemption.corporate

import com.gu.support.redemption.corporate.DynamoUpdate.DynamoFieldUpdate
import com.gu.support.redemptions.RedemptionCode
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

class SetCodeStatusSpec extends AsyncFlatSpec with Matchers {

  "setCodeStatus" should "mark a code as used" in {
    val setCodeStatus = SetCodeStatus.withDynamoLookup {
      case ("CODE", DynamoFieldUpdate("available", false)) => Future.successful(())
      case _ => Future.failed(new Throwable)
    }
    setCodeStatus(RedemptionCode("CODE").right.get, RedemptionTable.AvailableField.CodeIsUsed).map {
      _ should be(())
    }
  }

  it should "mark a code as available" in {
    val setCodeStatus = SetCodeStatus.withDynamoLookup {
      case ("CODE", DynamoFieldUpdate("available", true)) => Future.successful(())
      case _ => Future.failed(new Throwable)
    }
    setCodeStatus(RedemptionCode("CODE").right.get, RedemptionTable.AvailableField.CodeIsAvailable).map {
      _ should be(())
    }
  }

  it should "be sure to fail if there is an overall dynamo failure" in {
    val setCodeStatus = SetCodeStatus.withDynamoLookup {
      case ("CODE", DynamoFieldUpdate("available", false)) => Future.failed(new RuntimeException("test exception"))
      case _ => Future.failed(new Throwable)
    }
    recoverToSucceededIf[RuntimeException] {
      setCodeStatus(RedemptionCode("CODE").right.get, RedemptionTable.AvailableField.CodeIsUsed)
    }
  }

}
