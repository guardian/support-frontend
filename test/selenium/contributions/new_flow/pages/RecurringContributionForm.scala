package selenium.contributions.new_flow.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, PayPalCheckout, TestUser}

case class RecurringContributionForm(testUser: TestUser)(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/recurring-guest"

  private val stripeButton = cssSelector(".form__radio-group-label[for='paymentMethodSelector-Stripe']")

  private val payPalButton = cssSelector(".form__radio-group-label[for='paymentMethodSelector-PayPal']")

  private object RegisterFields {
    private val firstName = id("contributionFirstName")
    private val lastName = id("contributionLastName")
    private val email = id("contributionEmail")

    def fillIn() {

      setValue(email, s"${testUser.username}@gu.com", clear = true)
      setValue(firstName, testUser.username, clear = true)
      setValue(lastName, testUser.username, clear = true)
    }

    def clear(): Unit = {
      clearValue(email)
      clearValue(firstName)
      clearValue(lastName)
    }
  }

  private val nextButton = id("qa-contribute-button")

  private val stateSelector = id("contributionState")

  def paymentPageHasLoaded: Boolean = pageHasElement(stripeButton) && pageHasElement(payPalButton)

  def detailsPageHasLoaded: Boolean = pageHasElement(nextButton)

  def clickNext: Unit = clickOn(nextButton)

  def selectState: Unit = setSingleSelectionValue(stateSelector, "NY")

  def fillInPersonalDetails() { RegisterFields.fillIn() }

  def clearForm(): Unit = RegisterFields.clear()

  // ----- Stripe ----- //

  def selectStripePayment(): Unit = clickOn(stripeButton)

  // ----- PayPal ----- //

  def selectPayPalPayment(): Unit = clickOn(payPalButton)

}
