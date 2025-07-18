package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe._
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.exceptions.RetryNone
import com.gu.support.workers.states.CreateSalesforceContactState
import com.gu.support.zuora.api.{
  DirectDebitGateway,
  DirectDebitTortoiseMediaGateway,
  StripeGatewayPaymentIntentsDefault,
}
import com.gu.test.tags.objects.IntegrationTest
import org.mockito.ArgumentMatchers._

import java.io.ByteArrayOutputStream
import scala.concurrent.Future
import scala.concurrent.duration._

class CreatePaymentMethodSpec extends AsyncLambdaSpec with MockContext {

  "CreatePaymentMethod" should "retrieve a valid PayPalReferenceTransaction when given a valid baid" taggedAs IntegrationTest in {
    val createPaymentMethod = new CreatePaymentMethod()

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod
      .handleRequestFuture(wrapFixture(createPayPalPaymentMethodContributionJson()), outStream, context)
      .map { _ =>
        // Check the output
        val createSalesforceContactState = Encoding.in[CreateSalesforceContactState](outStream.toInputStream)

        createSalesforceContactState.isSuccess should be(true)
        createSalesforceContactState.get._1.paymentMethod match {
          case payPal: PayPalReferenceTransaction =>
            payPal.PaypalBaid should be(validBaid)
            payPal.PaypalEmail should be("membership.paypal-buyer@theguardian.com")
          case _ => fail()
        }
      }
  }

  it should "retrieve a valid CreditCardReferenceTransaction when given a valid stripe token" in {

    val createPaymentMethod = new CreatePaymentMethod(mockServices)

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod
      .handleRequestFuture(wrapFixture(createStripePaymentMethodContributionJson()), outStream, context)
      .map { _ =>
        // Check the output
        val createSalesforceContactState = Encoding.in[CreateSalesforceContactState](outStream.toInputStream)

        createSalesforceContactState.isSuccess should be(true)
        createSalesforceContactState.get._1.paymentMethod match {
          case stripe: CreditCardReferenceTransaction =>
            withClue("stripe: " + stripe) {
              stripe.SecondTokenId should be("12345")
            }
          case _ => fail()
        }
      }
  }

  it should "retrieve a valid DirectDebitPaymentMethod when given valid DD fields" in {

    val createPaymentMethod = new CreatePaymentMethod(mockServices)

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod
      .handleRequestFuture(wrapFixture(createDirectDebitDigitalPackJson), outStream, context)
      .map { _ =>
        // Check the output
        val createSalesforceContactState = Encoding.in[CreateSalesforceContactState](outStream.toInputStream)

        createSalesforceContactState.isSuccess should be(true)
        createSalesforceContactState.get._1.paymentMethod match {
          case dd: DirectDebitPaymentMethod =>
            withClue("direct debit: " + dd) {
              dd.PaymentGateway should be(DirectDebitGateway)
            }
          case _ => fail()
        }
      }
  }

  it should "use the Tortoise Media payment gateway for Observer DD subs" in {

    val createPaymentMethod = new CreatePaymentMethod(mockServices)

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod
      .handleRequestFuture(wrapFixture(createDirectDebitObserverJson), outStream, context)
      .map { _ =>
        // Check the output
        val createSalesforceContactState = Encoding.in[CreateSalesforceContactState](outStream.toInputStream)

        createSalesforceContactState.isSuccess should be(true)
        createSalesforceContactState.get._1.paymentMethod match {
          case dd: DirectDebitPaymentMethod =>
            withClue("direct debit: " + dd) {
              dd.PaymentGateway should be(DirectDebitTortoiseMediaGateway)
            }
          case _ => fail()
        }
      }
  }

  it should "fail when passed invalid json" in {
    recoverToSucceededIf[RetryNone] {
      val createPaymentMethod = new CreatePaymentMethod()

      val outStream = new ByteArrayOutputStream()

      val inStream = "Test user".asInputStream

      createPaymentMethod.handleRequestFuture(inStream, outStream, mock[Context]).map { _ =>
        val p = outStream.toClass[PaymentMethod]
      }
    }
  }

  "StripeService" should "throw a card_declined StripeError" taggedAs IntegrationTest in {
    val stripeService =
      new StripeService(Configuration.load().stripeConfigProvider.get(true), configurableFutureRunner(40.seconds))
    val service = stripeService.withPublicKey(stripeService.config.defaultAccount.publicKey)
    val ex = recoverToExceptionIf[StripeError] {
      service.createCustomerFromPaymentMethod(PaymentMethodId("pm_card_visa_chargeDeclined").get)
    }
    ex.map(_.code should be(Some("card_declined")))
  }

  private lazy val mockServices = {
    // Mock the stripe service as we cannot actually create a customer
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    val stripe = mock[StripeService]
    val stripeWithCurrency = mock[StripeServiceForAccount]
    val card1 = getPaymentMethod.StripeCard(StripeBrand.Visa, "1234", 1, 2099, "GB")
    val paymentMethod = getPaymentMethod.StripePaymentMethod(card1)
    when(stripeWithCurrency.getPaymentMethod).thenReturn(Function.const(Future(paymentMethod)) _)
    val customer1 = createCustomerFromPaymentMethod.Customer("12345")
    when(stripeWithCurrency.createCustomerFromPaymentMethod).thenReturn(Function.const(Future(customer1)) _)
    when(stripeWithCurrency.paymentIntentGateway).thenReturn(StripeGatewayPaymentIntentsDefault)
    when(services.stripeService).thenReturn(stripe)
    when(stripe.withPublicKey(StripePublicKey(anyString()))).thenReturn(stripeWithCurrency)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }
}
