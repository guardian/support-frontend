package selenium.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, PayPalCheckout, TestUser}

case class RecurringContributionForm(testUser: TestUser)(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/recurring-guest"

  private val stripeButton = id("qa-pay-with-card")

  private val payPalButton = id("component-paypal-button-checkout")

  private object RegisterFields {
    private val firstName = id("first-name")
    private val lastName = id("last-name")
    private val email = id("email")

    def fillIn() {

      setValue(email, s"${testUser.username}@gu.com", clear = true)
      setValue(firstName, testUser.username, clear = true)
      setValue(lastName, testUser.username, clear = true)
    }

    def fillInWithoutEmail() {
      setValue(firstName, testUser.username, clear = true)
      setValue(lastName, testUser.username, clear = true)
    }
  }

  private val nextButton = id("qa-contribute-button")

  private val stateSelector = id("qa-state-dropdown")

  def paymentPageHasLoaded: Boolean = pageHasElement(stripeButton) && pageHasElement(payPalButton)

  def detailsPageHasLoaded: Boolean = pageHasElement(nextButton)

  def clickNext: Unit = clickOn(nextButton)

  def selectState: Unit = setSingleSelectionValue(stateSelector, "NY")

  def fillInPersonalDetails() { RegisterFields.fillIn() }

  def fillInPersonalDetailsNoEmail() { RegisterFields.fillInWithoutEmail() }

  // ----- Stripe ----- //

  def selectStripePayment(): Unit = clickOn(stripeButton)

  // ----- PayPal ----- //

  def selectPayPalPayment(): Unit = clickOn(payPalButton)

}
