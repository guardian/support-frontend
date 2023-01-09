package com.gu.patrons.services

import com.gu.supporterdata.model.Stage.DEV
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class SupporterDataDynamoServiceSpec extends AsyncFlatSpec with Matchers {
  "SupporterDataDynamoService" should "return false if a subscription doesn't exist" in {
    val identityId = "non_existent_identity_id"
    val subscriptionId = "non_existent_subscription_id"
    val dynamoService = SupporterDataDynamoService(DEV)
    dynamoService.subscriptionExists(identityId, subscriptionId).flatMap {
      case Right(userExists) if userExists =>
        fail(s"Subscription $subscriptionId should not exist")
      case Right(_) =>
        succeed
      case Left(errorMessage) => fail(errorMessage)
    }
  }
  "SupporterDataDynamoService" should "return true if a subscription does exist" ignore {
    // This test relies on a record being present in the dev data store so
    // I'm marking it as ignored in case that record gets deleted
    val identityId = "200065441"
    val subscriptionId = "A-S00445804"
    val dynamoService = SupporterDataDynamoService(DEV)
    dynamoService.subscriptionExists(identityId, subscriptionId).flatMap {
      case Right(userExists) if userExists =>
        succeed
      case Right(_) =>
        fail(s"Subscription $subscriptionId should exist")
      case Left(errorMessage) => fail(errorMessage)
    }
  }
}
