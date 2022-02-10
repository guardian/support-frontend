package com.gu.support.redemption.corporate

import com.gu.support.config.TouchPointEnvironments
import com.gu.support.redemption.corporate.CorporateCodeValidator.CorporateId
import com.gu.support.redemption.{CodeAlreadyUsed, CodeNotFound, ValidCorporateCode}
import com.gu.support.redemptions.RedemptionCode
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException

@IntegrationTest
class CorporateCodeStatusUpdaterITSpec extends AsyncFlatSpec with Matchers {

  private val dynamoTableAsync: DynamoTableAsync = RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX)
  val corporateCodeStatusUpdater = CorporateCodeStatusUpdater.withDynamoUpdate(dynamoTableAsync)
  val codeValidator = CorporateCodeValidator.withDynamoLookup(dynamoTableAsync)

  // this is one test because it depends on external state which may not be in a particular state
  "corporateCodeStatusUpdater" should "set a code available and used" in {
    val mutableCode: RedemptionCode = RedemptionCode("it-mutable123").right.get
    for {
      _ <- corporateCodeStatusUpdater.setStatus(
        mutableCode,
        RedemptionTable.AvailableField.CodeIsUsed,
      ) // get in known state
      _ <- corporateCodeStatusUpdater.setStatus(mutableCode, RedemptionTable.AvailableField.CodeIsAvailable).map {
        _ should be(())
      }
      _ <- codeValidator.getStatus(mutableCode).map {
        _ should be(ValidCorporateCode(CorporateId("1")))
      }
      _ <- corporateCodeStatusUpdater.setStatus(mutableCode, RedemptionTable.AvailableField.CodeIsUsed).map {
        _ should be(())
      }
      a <- codeValidator.getStatus(mutableCode).map {
        _ should be(CodeAlreadyUsed)
      }
    } yield a
  }

  "corporateCodeStatusUpdater" should "not set a code that doesn't exist" in {
    val missingCode = RedemptionCode("it-missing123").right.get
    for {
      _ <- recoverToSucceededIf[ConditionalCheckFailedException] {
        corporateCodeStatusUpdater.setStatus(missingCode, RedemptionTable.AvailableField.CodeIsAvailable)
      }
      a <- codeValidator.getStatus(missingCode).map {
        _ should be(CodeNotFound)
      }
    } yield a
  }

}
