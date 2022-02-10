package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.Stripe.StripeList
import com.gu.stripe._
import com.gu.support.workers.JsonFixtures.{validBaid, _}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.exceptions.RetryNone
import com.gu.support.workers.states.CreateSalesforceContactState
import com.gu.test.tags.objects.IntegrationTest
import org.mockito.ArgumentMatchers._
import org.mockito.Mockito._

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
          case Left(payPal: PayPalReferenceTransaction) =>
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
      .handleRequestFuture(wrapFixture(createStripeSourcePaymentMethodContributionJson()), outStream, context)
      .map { _ =>
        // Check the output
        val createSalesforceContactState = Encoding.in[CreateSalesforceContactState](outStream.toInputStream)

        createSalesforceContactState.isSuccess should be(true)
        createSalesforceContactState.get._1.paymentMethod match {
          case Left(stripe: CreditCardReferenceTransaction) =>
            stripe.TokenId should be("1234")
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
    val service =
      new StripeService(Configuration.load().stripeConfigProvider.get(true), configurableFutureRunner(40.seconds))
        .withCurrency(GBP)
    val ex = recoverToExceptionIf[StripeError] {
      service.createCustomerFromToken("tok_chargeDeclined")
    }
    ex.map(_.code should be(Some("card_declined")))
  }

  private lazy val mockServices = {
    // Mock the stripe service as we cannot actually create a customer
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    val stripe = mock[StripeService]
    val stripeWithCurrency = mock[StripeServiceForCurrency]
    val card1 = getPaymentMethod.StripeCard(StripeBrand.Visa, "1234", 1, 2099, "GB")
    val paymentMethod = getPaymentMethod.StripePaymentMethod(card1)
    when(stripeWithCurrency.getPaymentMethod).thenReturn(Function.const(Future(paymentMethod)) _)
    val customer1 = createCustomerFromPaymentMethod.Customer("12345")
    when(stripeWithCurrency.createCustomerFromPaymentMethod).thenReturn(Function.const(Future(customer1)) _)
    val card2 = createCustomerFromToken.Customer.StripeCard("1234", StripeBrand.Visa, "1234", 1, 2099, "GB")
    val customer2 = createCustomerFromToken.Customer("12345", StripeList(1, Seq(card2)))
    when(stripeWithCurrency.createCustomerFromToken).thenReturn(Function.const(Future(customer2)) _)
    when(services.stripeService).thenReturn(stripe)
    when(stripe.withCurrency(any[Currency])).thenReturn(stripeWithCurrency)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }
}
