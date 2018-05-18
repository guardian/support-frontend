package selenium.pages

import selenium.util.{Browser, Config, TestUser}
import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page

case class OneOffContributionForm(testUser: TestUser, amount: Int, currency: String)(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/one-off?contributionValue=${amount}&contribType=ONE_OFF&currency=${currency}"

  private val payWithCard = id("qa-pay-with-card")

  private val contributePayPalButton = id("qa-contribute-paypal-button")

  private object RegisterFields {
    val fullName = id("name")
    val email = id("email")

    def fillIn() {
      setValue(fullName, testUser.username, clear = true)
      setValue(email, s"${testUser.username}@gu.com", clear = true)
    }
  }

  def pageHasLoaded: Boolean = pageHasElement(payWithCard)

  def fillInPersonalDetails() { RegisterFields.fillIn() }

  def clickContributeByCard: Unit = clickOn(payWithCard)

  def clickContributePayPalButton: Unit = clickOn(contributePayPalButton)

}
