package com.gu.support.workers.integration

import java.util.UUID

import com.gu.salesforce.Fixtures.idId
import com.gu.support.redemption.GetCodeStatus.{CodeAlreadyUsed, NoSuchCode}
import com.gu.support.redemption.generator.CodeBuilder.GiftCode
import com.gu.support.redemption.generator.GiftCodeGeneratorService
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.JsonFixtures.{createDigiPackGiftRedemptionJson, createDigiPackGiftSubscriptionJson}
import com.gu.support.workers.{Annual, AsyncLambdaSpec, BillingPeriod, Fixtures, MockContext, RequestInfo}
import com.gu.support.workers.lambdas.{DigitalSubscriptionGiftRedemption, HandlerResult}
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.test.tags.annotations.IntegrationTest
import org.mockito.ArgumentMatchers.any
import io.circe.parser.decode

import scala.concurrent.Future

@IntegrationTest
class GiftSubscriptionZuoraSpec extends CreateZuoraSubscriptionBaseSpec {

  val requestId = UUID.randomUUID()
  val giftCode = new GiftCodeGeneratorService().generateCode(Annual)
  val mockCodeGenerator = mock[GiftCodeGeneratorService]
  when(mockCodeGenerator.generateCode(any[BillingPeriod])).thenReturn(giftCode)

  // This spec relies on the fact that tests within a spec are executed in sequence
  // So we can create a sub, redeem it and then try to redeem it again to get an error

  "DigitalSubscriptionGiftRedemption" should "throw a NoSuchCode exception" in {
    val nonExistentCode = giftCode.value // We haven't created a sub with this yet

    recoverToExceptionIf[RuntimeException](
      redeemSubscription(nonExistentCode, requestId)
    ).map(_.getMessage shouldBe NoSuchCode.clientCode)
  }

  "CreateZuoraSubcription" should "create a Digital Pack gift subscription" in {
    createSubscription(createDigiPackGiftSubscriptionJson(requestId), mockCodeGenerator)
      .map { case (_, maybeError, _) => maybeError shouldBe None }
  }

  "DigitalSubscriptionGiftRedemption" should "redeem an unredeemed Digital Pack gift subscription" in
    redeemSubscription(giftCode.value, requestId)
      .map(_.value.user.id shouldBe idId)

  it should "return a successful redemption result if a subscription has already been redeemed in the current request" in
    redeemSubscription(giftCode.value, requestId)
      .map(_.value.user.id shouldBe idId)

  it should "throw a CodeAlreadyUsed exception if a subscription has been redeemed in a previous request" in {
    val previousRequestId = UUID.randomUUID()
    recoverToExceptionIf[RuntimeException](
      redeemSubscription(giftCode.value, previousRequestId)
    ).map(_.getMessage shouldBe CodeAlreadyUsed.clientCode)
  }

  def redeemSubscription(codeValue: String, requestId: UUID): Future[HandlerResult[SendThankYouEmailState]] = {
    val code = RedemptionCode(codeValue).right.get
    val state = decode[CreateZuoraSubscriptionState](createDigiPackGiftRedemptionJson(codeValue, requestId)).right.get

    DigitalSubscriptionGiftRedemption.redeemGift(
      RedemptionData(code),
      RequestInfo(testUser = false, failed = false, Nil, accountExists = false),
      state,
      mockZuoraService,
      realCatalogService
    )
  }
}
