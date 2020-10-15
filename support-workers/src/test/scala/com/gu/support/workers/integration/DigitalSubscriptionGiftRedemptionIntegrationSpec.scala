package com.gu.support.workers.integration

import java.util.UUID

import com.gu.monitoring.SafeLogger
import com.gu.salesforce.Fixtures.idId
import com.gu.support.redemption.{CodeAlreadyUsed, CodeNotFound}
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.JsonFixtures.{createDigiPackGiftRedemptionJson, createDigiPackGiftSubscriptionJson}
import com.gu.support.workers.lambdas.{DigitalSubscriptionGiftRedemption, HandlerResult}
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.workers._
import com.gu.test.tags.annotations.IntegrationTest
import io.circe.parser.decode
import org.mockito.ArgumentMatchers.any

import scala.concurrent.Future

@IntegrationTest
class DigitalSubscriptionGiftRedemptionIntegrationSpec extends AsyncLambdaSpec with MockContext {

  "DigitalSubscriptionGiftRedemption" should "throw a NoSuchCode exception" in {
    val createZuoraHelper = new CreateZuoraSubscriptionHelper()

    val requestId = UUID.randomUUID()
    val giftCode = new GiftCodeGeneratorService().generateCode(Annual)
    SafeLogger.info(s"Gift code non existent = $giftCode")
    val nonExistentCode = giftCode.value // We haven't created a sub with this

    recoverToExceptionIf[RuntimeException](
      redeemSubscription(createZuoraHelper, nonExistentCode, requestId)
    ).map(_.getMessage shouldBe CodeNotFound.clientCode)
  }

  "CreateZuoraSubcription" should "create a Digital Pack gift subscription, redeem it in exactly one request" in {
    val createZuoraHelper = new CreateZuoraSubscriptionHelper()

    val createSubRequestId = UUID.randomUUID()
    val redeemSubRequestId = UUID.randomUUID()
    val giftCode = new GiftCodeGeneratorService().generateCode(Annual)
    SafeLogger.info(s"Gift code to create = $giftCode")
    val mockCodeGenerator = mock[GiftCodeGeneratorService]
    when(mockCodeGenerator.generateCode(any[BillingPeriod])).thenReturn(giftCode)

    for {
      _ <- createZuoraHelper.createSubscription(createDigiPackGiftSubscriptionJson(createSubRequestId), mockCodeGenerator)
        .map { case (_, maybeError, _) => maybeError shouldBe None }

      _ <- redeemSubscription(createZuoraHelper, giftCode.value, redeemSubRequestId)
        .map(_.value.user.id shouldBe idId)

      _ <- redeemSubscription(createZuoraHelper, giftCode.value, redeemSubRequestId) // same request
        .map(_.value.user.id shouldBe idId)

      subsequentRequestId = UUID.randomUUID()
      assertion <- recoverToExceptionIf[RuntimeException](
        redeemSubscription(createZuoraHelper, giftCode.value, subsequentRequestId)
      ).map(_.getMessage shouldBe CodeAlreadyUsed.clientCode)
    } yield assertion
  }

  def redeemSubscription(
    createZuoraHelper: CreateZuoraSubscriptionHelper,
    codeValue: String,
    requestId: UUID
  ): Future[HandlerResult[SendThankYouEmailState]] = {
    val code = RedemptionCode(codeValue).right.get
    val state = decode[CreateZuoraSubscriptionState](createDigiPackGiftRedemptionJson(codeValue, requestId)).right.get

    DigitalSubscriptionGiftRedemption.redeemGift(
      RedemptionData(code),
      RequestInfo(testUser = false, failed = false, Nil, accountExists = false),
      state,
      createZuoraHelper.realZuoraGiftService,
      createZuoraHelper.realCatalogService
    )
  }
}
