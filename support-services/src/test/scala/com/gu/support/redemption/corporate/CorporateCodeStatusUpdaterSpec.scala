package com.gu.support.redemption.corporate

import com.gu.support.redemption.corporate.DynamoUpdate.DynamoFieldUpdate
import com.gu.support.redemptions.RedemptionCode
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.concurrent.Future

class CorporateCodeStatusUpdaterSpec extends AsyncFlatSpec with Matchers {

  val testCode = "test-code-123"

  "corporateCodeStatusUpdater" should "mark a code as used" in {
    val corporateCodeStatusUpdater = CorporateCodeStatusUpdater.withDynamoUpdate {
      case (`testCode`, DynamoFieldUpdate("available", false)) => Future.successful(())
      case _ => Future.failed(new Throwable)
    }
    corporateCodeStatusUpdater
      .setStatus(RedemptionCode(testCode).right.get, RedemptionTable.AvailableField.CodeIsUsed)
      .map {
        _ should be(())
      }
  }

  it should "mark a code as available" in {
    val corporateCodeStatusUpdater = CorporateCodeStatusUpdater.withDynamoUpdate {
      case (`testCode`, DynamoFieldUpdate("available", true)) => Future.successful(())
      case _ => Future.failed(new Throwable)
    }
    corporateCodeStatusUpdater
      .setStatus(RedemptionCode(testCode).right.get, RedemptionTable.AvailableField.CodeIsAvailable)
      .map {
        _ should be(())
      }
  }

  it should "be sure to fail if there is an overall dynamo failure" in {
    val corporateCodeStatusUpdater = CorporateCodeStatusUpdater.withDynamoUpdate {
      case (`testCode`, DynamoFieldUpdate("available", false)) => Future.failed(new RuntimeException("test exception"))
      case _ => Future.failed(new Throwable)
    }
    recoverToSucceededIf[RuntimeException] {
      corporateCodeStatusUpdater.setStatus(
        RedemptionCode(testCode).right.get,
        RedemptionTable.AvailableField.CodeIsUsed,
      )
    }
  }

}
