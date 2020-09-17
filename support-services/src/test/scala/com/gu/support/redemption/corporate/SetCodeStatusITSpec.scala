package com.gu.support.redemption.corporate

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.corporate.GetCodeStatus.{CodeAlreadyUsed, CorporateId, NoSuchCode}
import com.gu.support.redemptions.RedemptionCode
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException

@IntegrationTest
class SetCodeStatusITSpec extends AsyncFlatSpec with Matchers {

  private val dynamoTableAsync: DynamoTableAsync = RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX)
  val setCodeStatus = SetCodeStatus.withDynamoLookup(dynamoTableAsync)
  val getCodeStatus = GetCodeStatus.withDynamoLookup(dynamoTableAsync)

  // this is one test because it depends on external state which may not be in a particular state
  "setCodeStatus" should "set a code available and used" in {
    val mutableCode: RedemptionCode = RedemptionCode("ITTEST-MUTABLE").right.get
    for {
      _ <- setCodeStatus(mutableCode, RedemptionTable.AvailableField.CodeIsUsed) // get in known state
      _ <- setCodeStatus(mutableCode, RedemptionTable.AvailableField.CodeIsAvailable).map {
        _ should be(())
      }
      _ <- getCodeStatus(mutableCode).map {
        _ should be(Right(CorporateId("1")))
      }
      _ <- setCodeStatus(mutableCode, RedemptionTable.AvailableField.CodeIsUsed).map {
        _ should be(())
      }
      a <- getCodeStatus(mutableCode).map {
        _ should be(Left(CodeAlreadyUsed))
      }
    } yield a
  }

  "setCodeStatus" should "not set a code that doesn't exist" in {
    val missingCode = RedemptionCode("ITTEST-MISSING").right.get
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
