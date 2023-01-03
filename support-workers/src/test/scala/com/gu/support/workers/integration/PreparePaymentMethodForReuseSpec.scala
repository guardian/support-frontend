package com.gu.support.workers.integration

import com.gu.config.Configuration
import com.gu.i18n.Country
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.errors.MockServicesCreator
import com.gu.support.workers.lambdas.PreparePaymentMethodForReuse
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.ContributionState
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.{AsyncLambdaSpec, CreditCardReferenceTransaction, MockContext}
import com.gu.support.zuora.api.StripeGatewayPaymentIntentsDefault
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.ZuoraService
import org.mockito.ArgumentMatchers.any
import org.mockito.invocation.InvocationOnMock
import org.scalatest.Inside.inside

import java.io.ByteArrayOutputStream
import scala.concurrent.duration._

@IntegrationTest
class PreparePaymentMethodForReuseSpec extends AsyncLambdaSpec with MockServicesCreator with MockContext {

  "ClonePaymentMethod lambda" should "clone CreditCard Payment Method" in {
    val preparePaymentMethodForReuse = new PreparePaymentMethodForReuse(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()
    val cardAccount = "2c92c0f87568d98001756b53a3c30b7b"
    val in = wrapFixture(getPaymentMethodJson(billingAccountId = cardAccount, userId = "100004131"))

    preparePaymentMethodForReuse.handleRequestFuture(in, outStream, context).map { _ =>
      val response = Encoding.in[CreateZuoraSubscriptionState](outStream.toInputStream).get

      inside(response._1.productSpecificState) { case state: ContributionState =>
        state.paymentMethod shouldBe CreditCardReferenceTransaction(
          TokenId = "card_EdajV2eXkZPrVV",
          SecondTokenId = "cus_EdajoRmjUSlef9",
          CreditCardNumber = "************4242",
          CreditCardCountry = Some(Country.US),
          CreditCardExpirationMonth = 2,
          CreditCardExpirationYear = 2082,
          CreditCardType = Some("Visa"),
          PaymentGateway = StripeGatewayPaymentIntentsDefault,
          StripePaymentType = None,
        )
      }
    }

  }

  val realConfig = Configuration.load()

  val realZuoraService =
    new ZuoraService(realConfig.zuoraConfigProvider.get(false), configurableFutureRunner(60.seconds))

  val realPromotionService = new PromotionService(realConfig.promotionsConfigProvider.get(false))

  val mockZuoraService = {
    val mockZuora = mock[ZuoraService]
    // Need to return None from the Zuora service `getRecurringSubscription`
    // method or the subscribe step gets skipped
    // if these methods weren't coupled into one class then we could pass them separately and avoid reflection
    when(mockZuora.getObjectAccount(any[String]))
      .thenAnswer((invocation: InvocationOnMock) =>
        realZuoraService.getObjectAccount(invocation.getArguments.head.asInstanceOf[String]),
      )
    when(mockZuora.getPaymentMethod(any[String]))
      .thenAnswer((invocation: InvocationOnMock) =>
        realZuoraService.getPaymentMethod(invocation.getArguments.head.asInstanceOf[String]),
      )
    when(mockZuora.config).thenReturn(realZuoraService.config)
    mockZuora
  }

  lazy val mockServiceProvider = mockServices[Any](
    (s => s.zuoraService, mockZuoraService),
    (s => s.promotionService, realPromotionService),
  )
}
