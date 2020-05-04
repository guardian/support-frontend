package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration.{promotionsConfigProvider, zuoraConfigProvider}
import com.gu.i18n.Country
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.errors.MockServicesCreator
import com.gu.support.workers.lambdas.PreparePaymentMethodForReuse
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.{AsyncLambdaSpec, CreditCardReferenceTransaction, MockContext}
import com.gu.support.zuora.api.StripeGatewayDefault
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.ZuoraService
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.mockito.invocation.InvocationOnMock

import scala.concurrent.duration._

@IntegrationTest
class PreparePaymentMethodForReuseSpec extends AsyncLambdaSpec with MockServicesCreator with MockContext {

  "ClonePaymentMethod lambda" should "clone CreditCard Payment Method" in {
    val addZuoraSubscription = new PreparePaymentMethodForReuse(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()
    val cardAccount = "2c92c0f869330b7a01694982970a2b34"
    val in = wrapFixture(getPaymentMethodJson(billingAccountId = cardAccount, userId = "100004131"))


    addZuoraSubscription.handleRequestFuture(in, outStream, context).map { _ =>

      val response = Encoding.in[CreateZuoraSubscriptionState](outStream.toInputStream).get

      response._1.paymentMethod shouldBe Some(CreditCardReferenceTransaction(
        tokenId = "card_EdajV2eXkZPrVV",
        secondTokenId = "cus_EdajoRmjUSlef9",
        creditCardNumber = "4242",
        creditCardCountry = Some(Country.US),
        creditCardExpirationMonth = 2,
        creditCardExpirationYear = 2022,
        creditCardType = Some("Visa"),
        paymentGateway = StripeGatewayDefault,
        stripePaymentType = None
      ))
    }

  }

  val realZuoraService = new ZuoraService(zuoraConfigProvider.get(false), configurableFutureRunner(60.seconds))

  val realPromotionService = new PromotionService(promotionsConfigProvider.get(false))

  val mockZuoraService = {
    val mockZuora = mock[ZuoraService]
    // Need to return None from the Zuora service `getRecurringSubscription`
    // method or the subscribe step gets skipped
    // if these methods weren't coupled into one class then we could pass them separately and avoid reflection
    when(mockZuora.getObjectAccount(any[String]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.getObjectAccount(invocation.getArguments.head.asInstanceOf[String]))
    when(mockZuora.getPaymentMethod(any[String]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.getPaymentMethod(invocation.getArguments.head.asInstanceOf[String]))
    when(mockZuora.config).thenReturn(realZuoraService.config)
    mockZuora
  }

  lazy val mockServiceProvider = mockServices[Any](
    (s => s.zuoraService,
      mockZuoraService),
    (s => s.promotionService,
      realPromotionService)
  )
}
