package selenium.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, PayPalCheckout}

class RecurringContributionForm(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/recurring"

  private val stripeButton = id("qa-pay-with-card")

  private val payPalButton = id("component-paypal-button-checkout")

  private val stateSelector = id("qa-state-dropdown")

  def pageHasLoaded: Boolean = pageHasElement(stripeButton) && pageHasElement(payPalButton)

  def selectState: Unit = setSingleSelectionValue(stateSelector, "NY")

  // ----- Stripe ----- //

  def selectStripePayment(): Unit = clickOn(stripeButton)

  // ----- PayPal ----- //

  def selectPayPalPayment(): Unit = clickOn(payPalButton)

}
