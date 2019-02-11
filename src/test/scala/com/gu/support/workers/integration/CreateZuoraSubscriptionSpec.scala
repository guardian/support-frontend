package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration.{promotionsConfigProvider, zuoraConfigProvider}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.Fixtures._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.errors.MockServicesCreator
import com.gu.support.workers.lambdas.CreateZuoraSubscription
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.{Annual, IdentityId, LambdaSpec, Monthly}
import com.gu.support.zuora.api.response.ZuoraAccountNumber
import com.gu.support.zuora.api.{PreviewSubscribeRequest, SubscribeRequest}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.ZuoraService
import io.circe.generic.auto._
import org.mockito.Matchers.any
import org.mockito.Mockito.when
import org.mockito.invocation.InvocationOnMock

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

@IntegrationTest
class CreateZuoraSubscriptionSpec extends LambdaSpec with MockServicesCreator {

  "CreateZuoraSubscription lambda" should "create a monthly Zuora subscription" in {
    val createZuora = new CreateZuoraSubscription(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()
    val in = wrapFixture(createContributionZuoraSubscriptionJson(billingPeriod = Monthly))
    createZuora.handleRequest(in, outStream, context)

    val sendThankYouEmail = Encoding.in[SendThankYouEmailState](outStream.toInputStream).get
    sendThankYouEmail._1.subscriptionNumber.length should be > 0
  }

  "CreateZuoraSubscription lambda" should "create an annual Zuora subscription" in {
    val createZuora = new CreateZuoraSubscription(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequest(wrapFixture(createContributionZuoraSubscriptionJson(billingPeriod = Annual)), outStream, context)

    val sendThankYouEmail = Encoding.in[SendThankYouEmailState](outStream.toInputStream).get
    sendThankYouEmail._1.subscriptionNumber.length should be > 0
  }

  "CreateZuoraSubscription lambda" should "create a Digital Pack subscription" in {
    val createZuora = new CreateZuoraSubscription(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequest(wrapFixture(createDigiPackZuoraSubscriptionJson), outStream, context)

    val sendThankYouEmail = Encoding.in[SendThankYouEmailState](outStream.toInputStream).get
    sendThankYouEmail._1.subscriptionNumber.length should be > 0
  }

  it should "create a Digital Pack subscription with a discount" in {
    val createZuora = new CreateZuoraSubscription(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequest(wrapFixture(createDigiPackSubscriptionWithPromoJson), outStream, context)

    val sendThankYouEmail = Encoding.in[SendThankYouEmailState](outStream.toInputStream).get
    sendThankYouEmail._1.subscriptionNumber.length should be > 0
  }

  it should "create a Digital Pack subscription with a discount and free trial" in {

    val createZuora = new CreateZuoraSubscription(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()

    createZuora.handleRequest(digipackSubscriptionWithDiscountAndFreeTrialJson, outStream, context)

    val sendThankYouEmail = Encoding.in[SendThankYouEmailState](outStream.toInputStream).get
    sendThankYouEmail._1.subscriptionNumber.length should be > 0
  }

  val realZuoraService = new ZuoraService(zuoraConfigProvider.get(false), configurableFutureRunner(60.seconds))

  val realPromotionService = new PromotionService(promotionsConfigProvider.get(false))

  val mockZuoraService = {
    val mockZuora = mock[ZuoraService]
    // Need to return None from the Zuora service `getRecurringSubscription`
    // method or the subscribe step gets skipped
    // if these methods weren't coupled into one class then we could pass them separately and avoid reflection
    when(mockZuora.getAccountFields(any[IdentityId]))
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
