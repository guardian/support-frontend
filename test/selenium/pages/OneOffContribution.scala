package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, PayPalCheckout, TestUser}

case class OneOffContribution(testUser: TestUser, amount: Int, region: Option[String] = None) extends Page with Browser with StripeCheckout {

  val url: String = s"${Config.supportFrontendUrl}/contribute/one-off?contributionValue={$amount}&contribType=ONE_OFF" +
    region.map { r =>
      s"&country=${r.toUpperCase}"
    }.getOrElse("")

  private val name = id("name")

  private val email = id("email")

  private val postCode = id("postcode")

  private val fieldsErrorMessage = id("qa-payment-fields-error")

  private val stripeButton = id("qa-pay-with-card")

  private val payPalButton = id("qa-contribute-paypal-button")

  private val stateSelector = id("qa-state-dropdown")

  def pageHasLoaded: Boolean = pageHasElement(name) && pageHasElement(email) && pageHasElement(postCode)

  def selectState: Unit = setSingleSelectionValue(stateSelector, "NY")

  // ----- UI ----- //

  def stripeButtonIsVisible: Boolean = pageHasElement(stripeButton)

  def payPalButtonIsVisible: Boolean = pageHasElement(payPalButton)

  def fillInName(): Unit = {
    clickOn(name)
    setValueSlowly(name, testUser.username)
  }

  def fillInEmail()(): Unit = {
    clickOn(email)
    setValueSlowly(email, testUser.username + "@gu.com")
  }

  // ----- Stripe ----- //

  def selectStripePayment(): Unit = clickOn(stripeButton)

  def stripeCheckoutHasLoaded: Boolean = pageHasElement(stripeContainer)

  def stripeCheckoutHasCardNumberField: Boolean = pageHasElement(stripeCardNumber)

  def stripeCheckoutHasCvcField: Boolean = pageHasElement(stripeCardCvc)

  def stripeCheckoutHasExpiryField: Boolean = pageHasElement(stripeCardExp)

  def stripeCheckoutHasSubmitButton: Boolean = pageHasElement(stripeSubmitButton)

  def switchToStripe(): Unit = switchFrame(stripeContainer)

  def fillInCreditCardDetails(): Unit = stripeFillIn()

  def clickStripePayButton(): Unit = stripeAcceptPayment()

  // ----- Error ----- //

  def errorMessageIsVisible: Boolean = pageHasElement(fieldsErrorMessage)

  // ----- PayPal ----- //

  def selectPayPalPayment(): Unit = clickOn(payPalButton)

  def fillInPayPalDetails(): Unit = PayPalCheckout.fillIn

}
