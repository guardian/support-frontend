package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, PayPalCheckout}

object MonthlyContribution extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/recurring"

  private val stripeButton = id("qa-pay-with-card")

  private val payPalButton = id("component-paypal-button-checkout")

  private val stateSelector = id("qa-state-dropdown")

  def pageHasLoaded: Boolean = pageHasElement(stripeButton) && pageHasElement(payPalButton)

  def selectState: Unit = setSingleSelectionValue(stateSelector, "NY")

  // ----- Stripe ----- //

  def selectStripePayment(): Unit = clickOn(stripeButton)

  def stripeCheckoutHasLoaded: Boolean = pageHasElement(StripeCheckout.container)

  def stripeCheckoutHasCardNumberField: Boolean = pageHasElement(StripeCheckout.cardNumber)

  def stripeCheckoutHasCvcField: Boolean = pageHasElement(StripeCheckout.cardCvc)

  def stripeCheckoutHasExpiryField: Boolean = pageHasElement(StripeCheckout.cardExp)

  def stripeCheckoutHasSubmitButton: Boolean = pageHasElement(StripeCheckout.submitButton)

  def switchToStripe(): Unit = switchFrame(StripeCheckout.container)

  def fillInCreditCardDetails(): Unit = StripeCheckout.fillIn

  def clickStripePayButton(): Unit = StripeCheckout.acceptPayment

  // ----- PayPal ----- //

  def selectPayPalPayment(): Unit = clickOn(payPalButton)

  def fillInPayPalDetails(): Unit = PayPalCheckout.fillIn

  // Handles interaction with the Stripe Checkout iFrame.
  private object StripeCheckout {

    val container = name("stripe_checkout_app")

    // Unfortunately Stripe do not expose reliable ids on Checkout, so we currently use the following xpath:
    val cardNumber = xpath("//div[label/text() = \"Card number\"]/input")
    val cardExp = xpath("//div[label/text() = \"Expiry\"]/input")
    val cardCvc = xpath("//div[label/text() = \"CVC\"]/input")
    val submitButton = xpath("//div[button]")

    def fillIn(): Unit = {
      setValueSlowly(cardNumber, "4242 4242 4242 4242")
      setValueSlowly(cardExp, "1021")
      setValueSlowly(cardCvc, "111")
    }

    def acceptPayment(): Unit = clickOn(submitButton)

  }
}
