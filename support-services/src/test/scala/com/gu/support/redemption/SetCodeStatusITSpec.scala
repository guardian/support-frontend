package com.gu.support.redemption

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.GetCodeStatus.{CodeAlreadyUsed, NoSuchCode}
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException

@IntegrationTest
class SetCodeStatusITSpec extends AsyncFlatSpec with Matchers {

  private val dynamoTableAsync: DynamoTableAsync = RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX)
  private val mutableCode: RedemptionCode = RedemptionCode("ITTEST-MUTABLE")
  val setCodeStatus =
    SetCodeStatus.withDynamoLookup(dynamoTableAsync)
  val getCodeStatus = GetCodeStatus.withDynamoLookup(dynamoTableAsync)

  // the first two tests should use the same code
  "setCodeStatus" should "set a code available" in {
    for {
      _ <- setCodeStatus(mutableCode, RedemptionTable.AvailableField.CodeIsAvailable).map {
        _ should be(())
      }
      a <- getCodeStatus(mutableCode).map {
        _ should be(Right(()))
      }
    } yield a
  }

  it should "set a code used" in {
    for {
      _ <- setCodeStatus(mutableCode, RedemptionTable.AvailableField.CodeIsUsed).map {
        _ should be(())
      }
      a <- getCodeStatus(mutableCode).map {
        _ should be(Left(CodeAlreadyUsed))
      }
    } yield a
  }

  "setCodeStatus" should "not set a code that doesn't exist" in {
    val missingCode = RedemptionCode("ITTEST-MISSING")
    for {
      _ <- recoverToSucceededIf[ConditionalCheckFailedException] {
        setCodeStatus(missingCode, RedemptionTable.AvailableField.CodeIsAvailable)
      }
      a <- getCodeStatus(missingCode).map {
        _ should be(Left(NoSuchCode))
      }
    } yield a
  }

}
