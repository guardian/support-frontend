package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream
import java.time.OffsetDateTime

import com.gu.config.Configuration.{promotionsConfigProvider, zuoraConfigProvider}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.promotions.{DefaultPromotions, PromotionService}
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
import com.gu.zuora.ZuoraService
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
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
    createSubscription(createDigiPackCorporateSubscriptionJson)
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
    createSubscription(createGuardianWeeklySubscriptionJson(Quarterly, Some(DefaultPromotions.GuardianWeekly.NonGift.sixForSix)))
  }

  it should "create an Guardian Weekly gift subscription" in {
    createSubscription(guardianWeeklyGiftJson)
  }

  private def createSubscription(json: String) = {
    val createZuora = new CreateZuoraSubscription(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequestFuture(wrapFixture(json), outStream, context).map { _ =>

      val sendThankYouEmail = Encoding.in[SendThankYouEmailState](outStream.toInputStream).get
      sendThankYouEmail._1.subscriptionNumber.length should be > 0
    }
  }

  val realZuoraService = new ZuoraService(zuoraConfigProvider.get(), configurableFutureRunner(60.seconds))

  val realPromotionService = new PromotionService(promotionsConfigProvider.get())

  val mockZuoraService = {
    val mockZuora = mock[ZuoraService]
    // Need to return None from the Zuora service `getRecurringSubscription`
    // method or the subscribe step gets skipped
    // if these methods weren't coupled into one class then we could pass them separately and avoid reflection
    when(mockZuora.getAccountFields(any[IdentityId], any[OffsetDateTime]))
      .thenReturn(Future.successful(Nil))
    when(mockZuora.getSubscriptions(any[ZuoraAccountNumber]))
      .thenReturn(Future.successful(Nil))
    when(mockZuora.previewSubscribe(any[PreviewSubscribeRequest]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.previewSubscribe(invocation.getArguments.head.asInstanceOf[PreviewSubscribeRequest]))
    when(mockZuora.subscribe(any[SubscribeRequest]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.subscribe(invocation.getArguments.head.asInstanceOf[SubscribeRequest]))
    when(mockZuora.config).thenReturn(realZuoraService.config)
    mockZuora
  }

  val mockServiceProvider = mockServices[Any](
    (s => s.zuoraService,
      mockZuoraService),
    (s => s.promotionService,
      realPromotionService)
  )
}
