package selenium.contributions.new_flow.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, TestUser}

case class ContributionsLanding(region: String, testUser: TestUser)(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/$region/contribute"

  private val contributeButton = className("form__submit-button")

  private val contributePayPalButton = className("paypal-button")

  private val oneOffButton = cssSelector(".form__radio-group-label[for='contributionType-ONE_OFF']")
  private val monthlyButton = cssSelector(".form__radio-group-label[for='contributionType-MONTHLY']")
  private val annualButton = cssSelector(".form__radio-group-label[for='contributionType-ANNUAL']")

  private val otherAmountButton = cssSelector(".form__radio-group-label[for='contributionAmount-other']")

  private val otherAmount = id("contributionOther")

  private val stripeSelector = cssSelector(".form__radio-group-label[for='paymentMethodSelector-Stripe']")
  private val payPalSelector = cssSelector(".form__radio-group-label[for='paymentMethodSelector-PayPal']")
  private val stateSelector = id("contributionState")

  private object RegisterFields {
    private val firstName = id("contributionFirstName")
    private val lastName = id("contributionLastName")
    private val email = id("contributionEmail")

    def fillIn(hasNameFields: Boolean) {

      setValue(email, s"${testUser.username}@gu.com", clear = true)
      if (hasNameFields) {
        setValue(firstName, testUser.username, clear = true)
        setValue(lastName, testUser.username, clear = true)
      }
    }

    def clear(): Unit = {
      clearValue(email)
      clearValue(firstName)
      clearValue(lastName)
    }
  }

  def fillInPersonalDetails(hasNameFields: Boolean) { RegisterFields.fillIn(hasNameFields) }

  def clearForm(): Unit = RegisterFields.clear()

  def selectState: Unit = setSingleSelectionValue(stateSelector, "NY")

  def selectStripePayment(): Unit = clickOn(stripeSelector)

  def pageHasLoaded: Boolean = {
    pageHasElement(contributeButton)
    elementIsClickable(contributeButton)
  }

  def clickContribute: Unit = clickOn(contributeButton)

  def clickOneOff: Unit = clickOn(oneOffButton)
  def clickMonthly: Unit = clickOn(monthlyButton)
  def clickAnnual: Unit = clickOn(annualButton)

  def clickOtherAmount: Unit = clickOn(otherAmountButton)

  def enterAmount(amount: Double): Unit = setValueSlowly(otherAmount, amount.toString)

}
