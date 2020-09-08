package com.gu.support.workers.integration

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
class GiftSubcriptionZuoraSpec extends CreateZuoraSubscriptionBaseSpec {

  val giftCode = new GiftCodeGeneratorService().generateCode(Annual)
  val mockCodeGenerator = mock[GiftCodeGeneratorService]
  when(mockCodeGenerator.generateCode(any[BillingPeriod])).thenReturn(giftCode)

  // This spec relies on the fact that tests within a spec are executed in sequence
  // So we can create a sub, redeem it and then try to redeem it again to get an error

  "DigitalSubscriptionGiftRedemption" should "throw a NoSuchCode exception redeem a Digital Pack gift subscription" in {
    val nonExistentCode = giftCode.value // We haven't created a sub with this yet

    recoverToExceptionIf[RuntimeException](
      redeemSubscription(nonExistentCode)
    ).map(_.getMessage shouldBe NoSuchCode.clientCode)
  }

  "CreateZuoraSubcription" should "create a Digital Pack gift subscription" in {
    createSubscription(createDigiPackGiftSubscriptionJson, mockCodeGenerator)
      .map { case (_, maybeError, _) => maybeError shouldBe None }
  }

  "DigitalSubscriptionGiftRedemption" should "redeem a Digital Pack gift subscription" in
    redeemSubscription(giftCode.value)
      .map(_.value.user.id shouldBe idId)

  it should "throw a CodeAlreadyUsed exception redeem a Digital Pack gift subscription" in
    recoverToExceptionIf[RuntimeException](
      redeemSubscription(giftCode.value)
    ).map(_.getMessage shouldBe CodeAlreadyUsed.clientCode)


  def redeemSubscription(codeValue: String): Future[HandlerResult[SendThankYouEmailState]] = {
    val code = RedemptionCode(codeValue).right.get
    val state = decode[CreateZuoraSubscriptionState](createDigiPackGiftRedemptionJson(codeValue)).right.get

    DigitalSubscriptionGiftRedemption.redeemGift(
      RedemptionData(code),
      idId,
      RequestInfo(testUser = false, failed = false, Nil, accountExists = false),
      state,
      mockZuoraService,
      realCatalogService
    )
  }
}
