package selenium.pages

import selenium.util.Browser
// Handles interaction with the Stripe Checkout iFrame.

trait StripeCheckout extends Browser {

  val stripeContainer = name("stripe_checkout_app")

  // Unfortunately Stripe do not expose reliable ids on Checkout, so we currently use the following xpath:
  val stripeCardNumber = xpath("//div[label/text() = \"Card number\"]/input")
  val stripeCardExp = xpath("//div[label/text() = \"Expiry\"]/input")
  val stripeCardCvc = xpath("//div[label/text() = \"CVC\"]/input")
  val stripeSubmitButton = xpath("//div[button]")

  def stripeFillIn(): Unit = {
    setValueSlowly(stripeCardNumber, "4242 4242 4242 4242")
    setValueSlowly(stripeCardExp, "1021")
    setValueSlowly(stripeCardCvc, "111")
  }

  def stripeAcceptPayment(): Unit = clickOn(stripeSubmitButton)

}