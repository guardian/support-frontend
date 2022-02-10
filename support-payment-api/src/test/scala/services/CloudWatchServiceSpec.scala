package services

import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import model.Environment
import model.paypal.PaypalApiError
import model.stripe.StripeApiError
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar

class CloudWatchServiceSpec extends AnyWordSpec with Matchers with MockitoSugar with ScalaFutures {

  "CloudWatchService" when {
    val env = Environment.Live
    val async = mock[AmazonCloudWatchAsync]
    val cloudWatch = new CloudWatchService(async, env)
    "a PayPalAPIError is given" should {
      "Register as Payment Error in CloudWatch if paypal error is not card related" in {
        val error = PaypalApiError(Some(500), Some("INTERNAL_SERVICE_ERROR"), "Hi this is a test error")
        cloudWatch.isPaymentError(error) mustBe true
      }
      "Not Register as Payment Error in CloudWatch if paypal errorName is CREDIT_CARD_CVV_CHECK_FAILED" in {
        val error = PaypalApiError(Some(400), Some("CREDIT_CARD_CVV_CHECK_FAILED"), "Hi this is a test error")
        cloudWatch.isPaymentError(error) mustBe false
      }
      "Not Register as Payment Error in CloudWatch if paypal errorName is CREDIT_CARD_REFUSED" in {
        val error = PaypalApiError(Some(400), Some("CREDIT_CARD_REFUSED"), "Hi this is a test error")
        cloudWatch.isPaymentError(error) mustBe false
      }
      "Not Register as Payment Error in CloudWatch if paypal errorName is INSTRUMENT_DECLINED" in {
        val error = PaypalApiError(Some(400), Some("INSTRUMENT_DECLINED"), "Hi this is a test error")
        cloudWatch.isPaymentError(error) mustBe false
      }
      "Not Register as Payment Error in CloudWatch if paypal errorName is INSUFFICIENT_FUNDS" in {
        val error = PaypalApiError(Some(400), Some("INSUFFICIENT_FUNDS"), "Hi this is a test error")
        cloudWatch.isPaymentError(error) mustBe false
      }
    }

    "a StripeAPIError is given" should {
      "Register as Payment Error in CloudWatch if stripe error is not of type Card_Exception" in {
        val error = StripeApiError(
          Some("APIConnectionException"),
          Some(500),
          Some("api_key_required"),
          "Hi this is a test error",
          None,
        )
        cloudWatch.isPaymentError(error) mustBe true
      }
      "Do not register as Payment Error in CloudWatch if stripe error is of type Card_Exception" in {
        val error =
          StripeApiError(Some("CardException"), Some(500), Some("card_declined"), "Hi this is a test error", None)
        cloudWatch.isPaymentError(error) mustBe false
      }

    }
  }
}
