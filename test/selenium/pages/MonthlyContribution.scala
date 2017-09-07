package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

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

  def switchToPayPal(): Unit = {
    switchWindow
    switchFrame(PayPalCheckout.container)
  }

  def payPalCheckoutHasLoaded: Boolean = pageHasElement(PayPalCheckout.loginButton)

  def fillInPayPalDetails(): Unit = PayPalCheckout.fillIn

  def payPalLogin(): Unit = PayPalCheckout.logIn

  def payPalHasPaymentSummary(): Boolean = pageHasElement(PayPalCheckout.agreeAndPay)

  def payPalSummaryHasCorrectDetails(expectedCurrencyAndAmount: String): Boolean = elementHasText(PayPalCheckout.paymentAmount, expectedCurrencyAndAmount)

  def acceptPayPalPayment(): Unit = {
    pageDoesNotHaveElement(id("spinner"))
    PayPalCheckout.acceptPayment
    switchToParentWindow
  }

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

  // Handles interaction with the PayPal Express Checkout overlay.
  private object PayPalCheckout {

    val container = name("injectedUl")
    val loginButton = name("btnLogin")
    val emailInput = name("login_email")
    val passwordInput = name("login_password")
    val agreeAndPay = id("confirmButtonTop")
    val paymentAmount = className("formatCurrency")

    def fillIn(): Unit = {
      setValueSlowly(emailInput, Config.paypalBuyerEmail)
      setValueSlowly(passwordInput, Config.paypalBuyerPassword)
    }

    def logIn(): Unit = clickOn(loginButton)

    def acceptPayment(): Unit = clickOn(agreeAndPay)

  }

}
