package com.gu.zuora

import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.okhttp.RequestRunners
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.Fixtures._
import com.gu.zuora.model.response.ZuoraErrorResponse
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{AsyncFlatSpec, Matchers}

import scala.concurrent.duration._

@IntegrationTest
class ZuoraSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  def uatService: ZuoraService = new ZuoraService(zuoraConfigProvider.get(true), RequestRunners.configurableFutureRunner(30.seconds))

  "ZuoraService" should "retrieve an account" in {
    uatService.getAccount(Fixtures.accountNumber).map {
      response =>
        response.success should be(true)
        response.basicInfo.accountNumber should be(Fixtures.accountNumber)
    }
  }

  it should "retrieve account ids from an Identity id" in {
    uatService.getAccountIds("30000701").map {
      response =>
        response.nonEmpty should be(true)
    }
  }

  it should "be resistant to 'ZOQL injection'" in {
    a[NumberFormatException] should  be thrownBy uatService.getAccountIds("30000701' or status = 'Active")
  }

  it should "retrieve subscriptions from an account id" in {
    uatService.getSubscriptions("A00069602").map {
      response =>
        response.nonEmpty should be(true)
        response.head.ratePlans.head.productRatePlanId should be(zuoraConfigProvider.get(true).productRatePlanId)
    }
  }

  it should "be able to find a monthly recurring subscription" in {
    uatService.getMonthlyRecurringSubscription("30000701").map {
      response =>
        response.isDefined should be(true)
        response.get.ratePlans.head.productName should be("Contributor")
    }
  }

  "Subscribe request" should "succeed" in {
    val zuoraService = new ZuoraService(zuoraConfigProvider.get(), RequestRunners.configurableFutureRunner(30.seconds))
    zuoraService.subscribe(subscriptionRequest).map {
      response =>
        response.head.success should be(true)
    }
  }

  it should "work for $USD contributions" in {
    val zuoraService = new ZuoraService(zuoraConfigProvider.get(), RequestRunners.configurableFutureRunner(30.seconds))
    zuoraService.subscribe(usSubscriptionRequest).map {
      response =>
        response.head.success should be(true)
    }.recover {
      case e: ZuoraErrorResponse => logger.error(s"Zuora error: $e", e); fail()
    }
  }
}
