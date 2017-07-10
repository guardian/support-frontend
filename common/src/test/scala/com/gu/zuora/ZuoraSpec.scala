package com.gu.zuora

import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.okhttp.RequestRunners
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.Fixtures._
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{AsyncFlatSpec, Matchers}

import scala.concurrent.duration._

@IntegrationTest
class ZuoraSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  def uatService: ZuoraService = new ZuoraService(zuoraConfigProvider.get(true), RequestRunners.configurableFutureRunner(30.seconds))

  "ZuoraService" should "retrieve an account" in {
    uatService.getAccount(Fixtures.accountNumber).map {
      response =>
        logger.info(s"$response")
        response.success should be(true)
        response.basicInfo.accountNumber should be(Fixtures.accountNumber)
    }
  }

  it should "retrieve account ids from an Identity id" in {
    uatService.getAccountIds("30000701").map {
      response =>
        logger.info(s"$response")
        response.nonEmpty should be(true)
    }
  }

  it should "retrieve subscriptions from an account id" in {
    uatService.getSubscriptions("A00069602").map {
      response =>
        logger.info(s"$response")
        response.subscriptions.nonEmpty should be(true)
        response.subscriptions.head.ratePlans.head.productRatePlanId should be (zuoraConfigProvider.get(true).productRatePlanId)
    }
  }

//  it should "find out whether a user is a contributor" in {
//    uatService.userIsContributor("30000701").map {
//      response =>
//        logger.info(s"$response")
//        response.subscriptions.nonEmpty should be(true)
//        response.subscriptions.head.ratePlans.head.productRatePlanId should be (zuoraConfigProvider.get(true).productRatePlanId)
//    }
//  }

  "Subscribe request" should "succeed" in {
    val zuoraService = new ZuoraService(zuoraConfigProvider.get(), RequestRunners.configurableFutureRunner(30.seconds))
    zuoraService.subscribe(subscriptionRequest).map {
      response =>
        response.head.success should be(true)
    }
  }
}
