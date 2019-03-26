package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration.{promotionsConfigProvider, zuoraConfigProvider}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.errors.MockServicesCreator
import com.gu.support.workers.lambdas.GetPaymentMethod
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.{IdentityId, LambdaSpec, PayPalReferenceTransaction}
import com.gu.support.zuora.api.PreviewSubscribeRequest
import com.gu.support.zuora.api.response.ZuoraAccountNumber
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.ZuoraService
import io.circe.syntax._
import org.mockito.Matchers.any
import org.mockito.Mockito.when
import org.mockito.invocation.InvocationOnMock

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

@IntegrationTest
class GetPaymentMethodSpec extends LambdaSpec with MockServicesCreator {

  "ClonePaymentMethod lambda" should "clone CreditCard Payment Method" in {
    val addZuoraSubscription = new GetPaymentMethod(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()
    val cardAccount ="2c92c0f869330b7a01694982970a2b34"
    val ddAccount ="2c92c0f9699eca030169b57aa97600de"
    val in = wrapFixture(clonePaymentMethodJson(billingAccountId = cardAccount))


    addZuoraSubscription.handleRequest(in, outStream, context)

    val response = Encoding.in[CreateZuoraSubscriptionState](outStream.toInputStream).get
   println(s"RESPONSE : ${response._1.asJson}")

    response._1.paymentMethod.`type` shouldBe "CreditCardReferenceTransaction"
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
    //todo see if we can remove this one
    when(mockZuora.previewSubscribe(any[PreviewSubscribeRequest]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.previewSubscribe(invocation.getArguments.head.asInstanceOf[PreviewSubscribeRequest]))
    when(mockZuora.getObjectAccount(any[String]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.getObjectAccount(invocation.getArguments.head.asInstanceOf[String]))
    when(mockZuora.getPaymentMethod(any[String]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.getPaymentMethod(invocation.getArguments.head.asInstanceOf[String]))
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
