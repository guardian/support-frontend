package selenium.contributions.new_flow.pages

import selenium.util.{Browser, Config, TestUser}
import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page

case class OneOffContributionForm(testUser: TestUser, amount: Int, currency: String)(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/one-off?contributionValue=${amount}&contribType=ONE_OFF&currency=${currency}"

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
  }

  def fillInPersonalDetails() { RegisterFields.fillIn() }

  def clickContributeByCard(): Unit = clickOn(stripeButton)

  def clickContributePayPalButton(): Unit = clickOn(payPalButton)

}
