package services

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class StripeCheckoutSessionServiceSpec extends AnyFlatSpec with Matchers {
  "buildSuccessUrl" should "return a URL with the checkout session id placeholder" in {
    val referer = "https://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday"

    val successUrl = StripeCheckoutSessionService.buildSuccessUrl(referer)

    successUrl should be(
      Some(
        "https://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday&checkoutSessionId={CHECKOUT_SESSION_ID}",
      ),
    )
  }

  it should "remove any existing checkoutSessionId query parameter" in {
    val referer =
      "https://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday&checkoutSessionId=12345"

    val successUrl = StripeCheckoutSessionService.buildSuccessUrl(referer)

    successUrl should be(
      Some(
        "https://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday&checkoutSessionId={CHECKOUT_SESSION_ID}",
      ),
    )
  }

  it should "return None for domains which aren't in the allow-list" in {
    val referer = "https://www.example.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday"

    val successUrl = StripeCheckoutSessionService.buildSuccessUrl(referer)

    successUrl should be(None)
  }

  it should "return None for a non https referer" in {
    val referer = "http://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday"

    val successUrl = StripeCheckoutSessionService.buildSuccessUrl(referer)

    successUrl should be(None)
  }

  it should "return None for an invalid referer" in {
    val referer = "blahblahblah"

    val successUrl = StripeCheckoutSessionService.buildSuccessUrl(referer)

    successUrl should be(None)
  }

  "validateCancelUrl" should "return the referer if it's valid" in {
    val referer = "https://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday"

    val cancelUrl = StripeCheckoutSessionService.validateCancelUrl(referer)

    cancelUrl should be(Some(referer))
  }

  it should "remove any existing checkoutSessionId query parameter" in {
    val referer =
      "https://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday&checkoutSessionId=12345"

    val successUrl = StripeCheckoutSessionService.validateCancelUrl(referer)

    successUrl should be(
      Some(
        "https://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday",
      ),
    )
  }

  it should "return None if the referer is not a valid domain" in {
    val referer = "https://www.example.com?product=HomeDelivery&ratePlan=Sunday"

    val cancelUrl = StripeCheckoutSessionService.validateCancelUrl(referer)

    cancelUrl should be(None)
  }

  it should "return None for a non https referer" in {
    val referer = "http://support.theguardian.com/uk/checkout?product=HomeDelivery&ratePlan=Sunday"

    val cancelUrl = StripeCheckoutSessionService.validateCancelUrl(referer)

    cancelUrl should be(None)
  }
}
