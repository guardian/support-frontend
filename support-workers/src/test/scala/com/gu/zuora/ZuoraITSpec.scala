package com.gu.zuora

import com.gu.config.Configuration
import com.gu.helpers.DateGenerator
import com.gu.i18n.Currency.{AUD, EUR, GBP, USD}
import com.gu.okhttp.RequestRunners
import com.gu.support.config.Stages
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.workers.{GetSubscriptionWithCurrentRequestId, IdentityId}
import com.gu.support.zuora.api.response.{ZuoraAccountNumber, ZuoraErrorResponse}
import com.gu.support.zuora.api.{PreviewSubscribeRequest, SubscribeRequest}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.Fixtures._
import org.joda.time.{DateTime, DateTimeZone}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.util.UUID
import scala.concurrent.duration._

@IntegrationTest
class ZuoraITSpec extends AsyncFlatSpec with Matchers {

  def codeService: ZuoraService =
    new ZuoraService(
      Configuration.load().zuoraConfigProvider.get(),
      RequestRunners.configurableFutureRunner(30.seconds),
    )

  def codeGiftService: ZuoraGiftService =
    new ZuoraGiftService(
      Configuration.load().zuoraConfigProvider.get(),
      Stages.DEV,
      RequestRunners.configurableFutureRunner(30.seconds),
    )

  // actual sub "CreatedDate": "2017-12-07T15:47:21.000+00:00",
  val earlyDate = new DateTime(2010, 1, 1, 0, 0, 0, 0, DateTimeZone.UTC)

  "ZuoraService" should "retrieve an account" in {
    codeService.getAccount(Fixtures.accountNumber).map { response =>
      response.success should be(true)
      response.basicInfo.accountNumber should be(Fixtures.accountNumber)
    }
  }

  it should "retrieve account ids from an Identity id" in {
    codeService.getAccountFields(IdentityId("200110674").get, earlyDate).map { response =>
      response.nonEmpty should be(true)
    }
  }

  // I'm going to ignore this test for now since gifts expire after a year and the one we are currently
  // testing with has just expired
  ignore should "retrieve subscription redemption information from a redemption code" in {
    val redemptionCode = "gd12-it-test1"
    codeGiftService.getSubscriptionFromRedemptionCode(RedemptionCode(redemptionCode).toOption.get).map { response =>
      response.records.size shouldBe 1
      response.records.head.gifteeIdentityId shouldBe None
    }
  }

  it should "handle invalid redemption codes" in {
    val invalidRedemptionCode = "xxxx-0000-111"
    codeGiftService.getSubscriptionFromRedemptionCode(RedemptionCode(invalidRedemptionCode).toOption.get).map {
      response =>
        response.records.size shouldBe 0
    }
  }

  it should "be resistant to 'ZOQL injection'" in {
    // try https://github.com/guardian/support-service-lambdas/blob/main/lib/zuora/src/main/scala/com/gu/util/zuora/SafeQueryBuilder.scala
    IdentityId("30000701' or status = 'Active").isFailure should be(true)
  }

  it should "retrieve subscriptions from an account id" in {
    codeService.getSubscriptions(ZuoraAccountNumber("A00524080")).map { response =>
      response.nonEmpty should be(true)
      response.head.ratePlans.head.productRatePlanId should be(
        Configuration.load().zuoraConfigProvider.get(true).monthlyContribution.productRatePlanId,
      )
    }
  }

  it should "be able to find a monthly recurring subscription" in {
    GetSubscriptionWithCurrentRequestId(
      codeService,
      UUID.fromString("f5f42f0b-be6e-2d37-0000-00000000026c"),
      IdentityId("200110674").get,
      DateGenerator(earlyDate),
    ).map {
      _.flatMap(_.ratePlans.headOption.map(_.productName)) should be(Some("Contributor"))
    }
  }

  it should "ignore a subscription with wrong session id" in {
    GetSubscriptionWithCurrentRequestId(
      codeService,
      UUID.fromString("00000000-3001-4dbc-88c3-1f47d54c511c"),
      IdentityId("200110674").get,
      DateGenerator(earlyDate),
    ).map {
      _ should be(None)
    }
  }

  it should "retrieve a default paymentMethodId from an account number" in {
    val accountNumber = "A00524105"
    val defaultPaymentMethodId = Some("8ad094b9877a6f6001877adffe770aec")
    codeService.getDefaultPaymentMethodId(accountNumber).map { response =>
      response should be(defaultPaymentMethodId)
    }
  }

  it should "retrieve a Direct Debit mandateId from a valid paymentMethodId" in {
    val defaultPaymentMethodId = "8ad096ca877a6f4601877ae5adc86093"
    val mandateId = "XPE6XQZ"
    codeService.getDirectDebitMandateId(defaultPaymentMethodId).map { response =>
      response should be(Some(mandateId))
    }
  }

  it should "return None when given an invalid paymentMethodId" in {
    val invalidPaymentMethodId = "xxxx"
    codeService.getDirectDebitMandateId(invalidPaymentMethodId).map { response =>
      response should be(None)
    }
  }

  it should "retrieve a Direct Debit mandateId from a valid account number" in {
    val accountNumber = "A00524112"
    val mandateId = Some("XPE6XQZ")
    codeService.getMandateIdFromAccountNumber(accountNumber).map { response =>
      response should be(mandateId)
    }
  }

  it should "return None when given an invalid account number" in {
    val invalidAccountNumber = "xxxx"
    codeService.getMandateIdFromAccountNumber(invalidAccountNumber).map { response =>
      response should be(None)
    }
  }

  "Preview request" should "succeed" in doRequest(
    Left(PreviewSubscribeRequest.fromSubscribe(creditCardSubscriptionRequest(GBP).subscribes.head, 13)),
  )

  "Subscribe request" should "succeed" in doRequest(Right(creditCardSubscriptionRequest(GBP)))

  it should "work for $USD contributions" in doRequest(Right(creditCardSubscriptionRequest(USD)))

  it should "work for €Euro contributions" in doRequest(Right(creditCardSubscriptionRequest(EUR)))

  it should "work for AUD contributions" in doRequest(Right(creditCardSubscriptionRequest(AUD)))

  it should "work with Direct Debit" in doRequest(Right(directDebitSubscriptionRequest))

  it should "work for a paper subscription" in doRequest(Right(directDebitSubscriptionRequestPaper))

  private def doRequest(request: Either[PreviewSubscribeRequest, SubscribeRequest]) = {
    // Accounts will be created (or previewed) in CODE
    val zuoraService = new ZuoraService(
      Configuration.load().zuoraConfigProvider.get(),
      RequestRunners.configurableFutureRunner(30.seconds),
    )
    val futureResponse = request.fold(zuoraService.previewSubscribe, zuoraService.subscribe)
    futureResponse
      .map { response =>
        response.head.success should be(true)
      }
      .recover { case e: ZuoraErrorResponse =>
        fail(e)
      }
  }
}
