package com.gu.support.redemption

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.GetCodeStatus.{CodeAlreadyUsed, NoSuchCode}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class SetCodeStatusITSpec extends AsyncFlatSpec with Matchers {

  private val dynamoTableAsync: DynamoTableAsync = RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX)
  private val mutableCode: RedemptionCode = RedemptionCode("ITTEST-MUTABLE")
  val setCodeStatus =
    SetCodeStatus.withDynamoLookup(dynamoTableAsync)(mutableCode, _)

  val getCodeStatus = () =>
    GetCodeStatus.withDynamoLookup(dynamoTableAsync)(mutableCode)

  "setCodeStatus" should "set a code available" in {
    for {
      _ <- setCodeStatus(RedemptionTable.AvailableField.CodeIsAvailable).map {
        _ should be(())
      }
      a <- getCodeStatus().map {
        _ should be(Right(()))
      }
    } yield a
  }

  it should "set a code used" in {
    for {
      _ <- setCodeStatus(RedemptionTable.AvailableField.CodeIsUsed).map {
        _ should be(())
      }
      a <- getCodeStatus().map {
        _ should be(Left(CodeAlreadyUsed))
      }
    } yield a
  }

  // if the code doesn't exist, we can set it to available or not.  Should this be fixed?

}
