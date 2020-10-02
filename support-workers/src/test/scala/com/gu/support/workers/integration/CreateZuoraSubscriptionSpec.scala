package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.catalog.{CatalogService, SimpleJsonProvider}
import com.gu.support.config.{Stages, TouchPointEnvironments}
import com.gu.support.promotions.{DefaultPromotions, PromotionService}
import com.gu.support.redemption.CodeAlreadyUsed
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.support.redemption.corporate.{DynamoTableAsync, CorporateCodeValidator, RedemptionTable, SetCodeStatus}
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.workers.JsonFixtures.{createEverydayPaperSubscriptionJson, _}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.errors.MockServicesCreator
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.zuora.api.response.ZuoraAccountNumber
import com.gu.support.zuora.api.{PreviewSubscribeRequest, SubscribeRequest}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.{ZuoraGiftService, ZuoraService}
import io.circe.parser.parse
import org.joda.time.DateTime
import org.mockito.ArgumentMatchers.any
import org.mockito.invocation.InvocationOnMock

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

@IntegrationTest
class CreateZuoraSubscriptionSpec extends AsyncLambdaSpec with MockServicesCreator with MockContext {
  val createZuoraHelper = new CreateZuoraSubscriptionHelper()

  "CreateZuoraSubscription lambda" should "create a monthly Zuora subscription" in {
    testCreateSubscription(createContributionZuoraSubscriptionJson(billingPeriod = Monthly))
  }

  it should "create an annual Zuora subscription" in {
    testCreateSubscription(createContributionZuoraSubscriptionJson(billingPeriod = Annual))
  }

  it should "create a Digital Pack subscription" in {
    testCreateSubscription(createDigiPackZuoraSubscriptionJson)
  }

  it should "create a Digital Pack corporate subscription" in {
    val dynamoTableAsync: DynamoTableAsync = RedemptionTable.forEnvAsync(TouchPointEnvironments.SANDBOX)
    val setCodeStatus = SetCodeStatus.withDynamoLookup(dynamoTableAsync)
    val codeValidator = CorporateCodeValidator.withDynamoLookup(dynamoTableAsync)
    val mutableCode: RedemptionCode = RedemptionCode("ITTEST-MUTABLE").right.get
    for {
      _ <- setCodeStatus(mutableCode, RedemptionTable.AvailableField.CodeIsAvailable)
      _ <- createZuoraHelper.createSubscription(createDigiPackCorporateSubscriptionJson)
      r <- codeValidator.getStatus(mutableCode).map {
        _ should be(CodeAlreadyUsed)
      }
    } yield r
  }

  it should "create a Digital Pack subscription with a discount" in {
    testCreateSubscription(createDigiPackSubscriptionWithPromoJson)
  }

  it should "create a Digital Pack subscription with a discount and free trial" in {
    testCreateSubscription(digipackSubscriptionWithDiscountAndFreeTrialJson)
  }

  it should "create an everyday paper subscription" in {
    testCreateSubscription(createEverydayPaperSubscriptionJson)
  }

  it should "create an Annual Guardian Weekly subscription" in {
    testCreateSubscription(createGuardianWeeklySubscriptionJson(Annual))
  }

  it should "create an Quarterly Guardian Weekly subscription" in {
    testCreateSubscription(createGuardianWeeklySubscriptionJson(Quarterly))
  }

  it should "create a 6 for 6 Guardian Weekly subscription" in {
    testCreateSubscription(createGuardianWeeklySubscriptionJson(SixWeekly, Some(DefaultPromotions.GuardianWeekly.NonGift.sixForSix)))
  }

  it should "create an Guardian Weekly gift subscription" in {
    testCreateSubscription(guardianWeeklyGiftJson)
  }

  def testCreateSubscription(json: String) =
    createZuoraHelper.createSubscription(json)
      .map(
        _._1.subscriptionNumber.length should be > 1
      )
}

class CreateZuoraSubscriptionHelper(implicit executionContext: ExecutionContext) extends MockServicesCreator with MockContext {

  def createSubscription(
    json: String,
    giftCodeGenerator: GiftCodeGeneratorService = new GiftCodeGeneratorService
  )(implicit executionContext: ExecutionContext): Future[(SendThankYouEmailState, Option[ExecutionError], RequestInfo)] = {
    val createZuora = new CreateZuoraSubscription(mockServiceProvider(giftCodeGenerator))

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequestFuture(wrapFixture(json), outStream, context).map { _ =>
      Encoding.in[SendThankYouEmailState](outStream.toInputStream).get
    }
  }

  val realConfig = Configuration.load()

  val realZuoraService = new ZuoraService(realConfig.zuoraConfigProvider.get(), configurableFutureRunner(60.seconds))

  val realZuoraGiftService = new ZuoraGiftService(realConfig.zuoraConfigProvider.get(), configurableFutureRunner(60.seconds))

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

    when(mockZuora.config).thenReturn(realZuoraService.config)
    mockZuora
  }

  def mockServiceProvider(giftCodeGenerator: GiftCodeGeneratorService) = mockServices[Any](
    (s => s.zuoraService, mockZuoraService),
    (s => s.zuoraGiftService, realZuoraGiftService),
    (s => s.promotionService, realPromotionService),
    (s => s.redemptionService, realRedemptionService),
    (s => s.config, realConfig),
    (s => s.giftCodeGenerator, giftCodeGenerator),
    (s => s.catalogService, realCatalogService)
  )
}
