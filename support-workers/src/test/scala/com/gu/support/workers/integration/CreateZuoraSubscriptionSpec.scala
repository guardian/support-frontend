package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.catalog.{CatalogService, SimpleJsonProvider}
import com.gu.support.config.{Stages, TouchPointEnvironments}
import com.gu.support.promotions.{DefaultPromotions, PromotionService}
import com.gu.support.redemption.GetCodeStatus.{CodeAlreadyUsed, NoSuchCode}
import com.gu.support.redemption.generator.CodeBuilder.GiftCode
import com.gu.support.redemption.generator.GiftCodeGeneratorService
import com.gu.support.redemption.{DynamoTableAsync, GetCodeStatus, RedemptionTable, SetCodeStatus}
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers.JsonFixtures.{createEverydayPaperSubscriptionJson, _}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.errors.MockServicesCreator
import com.gu.support.workers.lambdas.{CreateZuoraSubscription, DigitalSubscriptionGiftRedemption}
import com.gu.support.workers.states.{CreateZuoraSubscriptionState, SendThankYouEmailState}
import com.gu.support.zuora.api.response.ZuoraAccountNumber
import com.gu.support.zuora.api.{PreviewSubscribeRequest, SubscribeRequest}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.ZuoraService
import io.circe.parser.{decode, parse}
import org.joda.time.DateTime
import org.mockito.ArgumentMatchers.any
import org.mockito.invocation.InvocationOnMock

import scala.concurrent.Future
import scala.concurrent.duration._

@IntegrationTest
class CreateZuoraSubscriptionSpec extends AsyncLambdaSpec with MockServicesCreator with MockContext {

  "CreateZuoraSubscription lambda" should "create a monthly Zuora subscription" in {
    createSubscription(createContributionZuoraSubscriptionJson(billingPeriod = Monthly))
  }

  it should "create an annual Zuora subscription" in {
    createSubscription(createContributionZuoraSubscriptionJson(billingPeriod = Annual))
  }

  it should "create a Digital Pack subscription" in {
    createSubscription(createDigiPackZuoraSubscriptionJson)
  }

  it should "create a Digital Pack corporate subscription" in {
    val dynamoTableAsync: DynamoTableAsync = RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX)
    val setCodeStatus = SetCodeStatus.withDynamoLookup(dynamoTableAsync)
    val getCodeStatus = GetCodeStatus.withDynamoLookup(dynamoTableAsync)
    val mutableCode: RedemptionCode = RedemptionCode("ITTEST-MUTABLE").right.get
    for {
      _ <- setCodeStatus(mutableCode, RedemptionTable.AvailableField.CodeIsAvailable)
      _ <- createSubscription(createDigiPackCorporateSubscriptionJson)
      r <- getCodeStatus(mutableCode).map {
        _ should be(Left(GetCodeStatus.CodeAlreadyUsed))
      }
    } yield r
  }

  it should "create a Digital Pack subscription with a discount" in {
    createSubscription(createDigiPackSubscriptionWithPromoJson)
  }

  it should "create a Digital Pack subscription with a discount and free trial" in {
    createSubscription(digipackSubscriptionWithDiscountAndFreeTrialJson)
  }

  it should "create an everyday paper subscription" in {
    createSubscription(createEverydayPaperSubscriptionJson)
  }

  it should "create an Annual Guardian Weekly subscription" in {
    createSubscription(createGuardianWeeklySubscriptionJson(Annual))
  }

  it should "create an Quarterly Guardian Weekly subscription" in {
    createSubscription(createGuardianWeeklySubscriptionJson(Quarterly))
  }

  it should "create a 6 for 6 Guardian Weekly subscription" in {
    createSubscription(createGuardianWeeklySubscriptionJson(SixWeekly, Some(DefaultPromotions.GuardianWeekly.NonGift.sixForSix)))
  }

  it should "create an Guardian Weekly gift subscription" in {
    createSubscription(guardianWeeklyGiftJson)
  }

  it should "create a Digital Pack gift subscription" in {
    createSubscription(createDigiPackGiftSubscriptionJson)
  }

  val giftCode = GiftCode("gd03-00000000").get

  it should "redeem a Digital Pack gift subscription" in {
    val mockCodeGenerator = mock[GiftCodeGeneratorService]
    when(mockCodeGenerator.generateCode(any[BillingPeriod])).thenReturn(giftCode)

    createSubscription(createDigiPackGiftSubscriptionJson, mockCodeGenerator).flatMap(_ =>
      createSubscription(createDigiPackGiftRedemptionJson(giftCode.value), mockCodeGenerator)
    )
  }

  it should "throw a CodeAlreadyUsed exception redeem a Digital Pack gift subscription" in {
    val state = decode[CreateZuoraSubscriptionState](createDigiPackGiftRedemptionJson(giftCode.value)).right.get
    val usedCode = RedemptionCode(giftCode.value).right.get

    val result = DigitalSubscriptionGiftRedemption.redeemGift(
      RedemptionData(usedCode),
      Fixtures.idId,
      RequestInfo(false, false, Nil, false),
      state,
      mockZuoraService,
      realCatalogService
    )

    recoverToExceptionIf[RuntimeException](result).map(
      exception => exception.getMessage shouldBe CodeAlreadyUsed.clientCode
    )
  }

  it should "throw a NoSuchCode exception redeem a Digital Pack gift subscription" in {
    val nonExistentCode = RedemptionCode("gd06-aaaaaaaa").right.get
    val state = decode[CreateZuoraSubscriptionState](createDigiPackGiftRedemptionJson("gd06-aaaaaaaa")).right.get

    val result = DigitalSubscriptionGiftRedemption.redeemGift(
      RedemptionData(nonExistentCode),
      Fixtures.idId,
      RequestInfo(false, false, Nil, false),
      state,
      mockZuoraService,
      realCatalogService
    )

    recoverToExceptionIf[RuntimeException](result).map(
      exception => exception.getMessage shouldBe NoSuchCode.clientCode
    )
  }

  private def createSubscription(json: String, giftCodeGenerator: GiftCodeGeneratorService = new GiftCodeGeneratorService) = {
    val createZuora = new CreateZuoraSubscription(mockServiceProvider(giftCodeGenerator))

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequestFuture(wrapFixture(json), outStream, context).map { _ =>

      val sendThankYouEmail = Encoding.in[SendThankYouEmailState](outStream.toInputStream).get
      sendThankYouEmail._1.user.id.length should be > 1
    }
  }

  val realConfig = Configuration.load()

  val realZuoraService = new ZuoraService(realConfig.zuoraConfigProvider.get(), configurableFutureRunner(60.seconds))

  val realPromotionService = new PromotionService(realConfig.promotionsConfigProvider.get())

  val realRedemptionService = RedemptionTable.forEnvAsync(TouchPointEnvironments.fromStage(Stages.DEV))

  private val json = parse("{}").right.get
  private val jsonProvider = new SimpleJsonProvider(json)
  lazy val realCatalogService = new CatalogService(TouchPointEnvironments.SANDBOX, jsonProvider)

  lazy val mockZuoraService = {
    val mockZuora = mock[ZuoraService]
    // Need to return None from the Zuora service `getRecurringSubscription`
    // method or the subscribe step gets skipped
    // if these methods weren't coupled into one class then we could pass them separately and avoid reflection
    when(mockZuora.getAccountFields(any[IdentityId], any[DateTime]))
      .thenReturn(Future.successful(Nil))
    when(mockZuora.getSubscriptions(any[ZuoraAccountNumber]))
      .thenReturn(Future.successful(Nil))
    when(mockZuora.previewSubscribe(any[PreviewSubscribeRequest]))
      .thenAnswer((invocation: InvocationOnMock) =>
        realZuoraService.previewSubscribe(invocation.getArguments.head.asInstanceOf[PreviewSubscribeRequest]))
    when(mockZuora.subscribe(any[SubscribeRequest]))
      .thenAnswer((invocation: InvocationOnMock) =>
        realZuoraService.subscribe(invocation.getArguments.head.asInstanceOf[SubscribeRequest]))
    when(mockZuora.getSubscriptionFromRedemptionCode(any[RedemptionCode]))
      .thenAnswer((invocation: InvocationOnMock) =>
        realZuoraService.getSubscriptionFromRedemptionCode(
          invocation.getArguments.head.asInstanceOf[RedemptionCode]
        ))
    when(mockZuora.getSubscriptionById(any[String]))
      .thenAnswer((invocation: InvocationOnMock) =>
        realZuoraService.getSubscriptionById(
          invocation.getArguments.head.asInstanceOf[String]
        ))
    when(mockZuora.updateSubscriptionRedemptionData(any[String], any[String], any[Int]))
      .thenAnswer((invocation: InvocationOnMock) =>
        realZuoraService.updateSubscriptionRedemptionData(
          invocation.getArgument(0).asInstanceOf[String],
          invocation.getArgument(1).asInstanceOf[String],
          invocation.getArgument(2).asInstanceOf[Int])
      )

    when(mockZuora.config).thenReturn(realZuoraService.config)
    mockZuora
  }

  def mockServiceProvider(giftCodeGenerator: GiftCodeGeneratorService) = mockServices[Any](
    (s => s.zuoraService, mockZuoraService),
    (s => s.promotionService, realPromotionService),
    (s => s.redemptionService, realRedemptionService),
    (s => s.config, realConfig),
    (s => s.giftCodeGenerator, giftCodeGenerator),
    (s => s.catalogService, realCatalogService)
  )
}
