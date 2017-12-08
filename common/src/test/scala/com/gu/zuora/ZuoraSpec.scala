package com.gu.zuora

import com.gu.config.Configuration.zuoraConfigProvider
import com.gu.i18n.Currency
import com.gu.i18n.Currency.{AUD, EUR, GBP, USD}
import com.gu.okhttp.RequestRunners
import com.gu.support.workers.model.Monthly
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
    uatService.getAccountIds("30001758").map {
      response =>
        response.nonEmpty should be(true)
    }
  }

  it should "be resistant to 'ZOQL injection'" in {
    a[NumberFormatException] should be thrownBy uatService.getAccountIds("30000701' or status = 'Active")
  }

  it should "retrieve subscriptions from an account id" in {
    uatService.getSubscriptions("A00071408").map {
      response =>
        response.nonEmpty should be(true)
        response.head.ratePlans.head.productRatePlanId should be(zuoraConfigProvider.get(true).monthlyContribution.productRatePlanId)
    }
  }

  it should "be able to find a monthly recurring subscription" in {
    uatService.getRecurringSubscription("30001758", Monthly).map {
      response =>
        response.isDefined should be(true)
        response.get.ratePlans.head.productName should be("Contributor")
    }
  }

  it should "ignore active subscriptions which do not have a recurring contributor plan" in {
    uatService.getRecurringSubscription("18390845", Monthly).map {
      response =>
        response.isDefined should be(false)
    }
  }

  it should "ignore cancelled recurring contributions" in {
    uatService.getRecurringSubscription("30001780", Monthly).map {
      response =>
        response.isDefined should be(false)
    }
  }

  "Subscribe request" should "succeed" in subscribeRequestWithCurrency(GBP)

  it should "work for $USD contributions" in subscribeRequestWithCurrency(USD)

  it should "work for €Euro contributions" in subscribeRequestWithCurrency(EUR)

  it should "work for AUD contributions" in subscribeRequestWithCurrency(AUD)

  def subscribeRequestWithCurrency(currency: Currency) = {
    //Accounts will be created in Sandbox
    val zuoraService = new ZuoraService(zuoraConfigProvider.get(), RequestRunners.configurableFutureRunner(30.seconds))
    zuoraService.subscribe(subscriptionRequest(currency)).map {
      response =>
        response.head.success should be(true)
    }.recover {
      case e: ZuoraErrorResponse => logger.error(s"Zuora error: $e", e); fail()
    }
  }
}
