package selenium.contributions.new_flow.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

case class ContributionsLanding(region: String)(implicit val webDriver: WebDriver) extends Page with Browser {

  // While the new contributions landing page test is running,
  // we just want Selenium to test the old page.
  val url = s"${Config.supportFrontendUrl}/$region/contribute"

  private val contributeButton = className("form__submit-button")

  private val contributePayPalButton = className("paypal-button")

  private val oneOffButton = cssSelector(".form__radio-group-label[for='contributionType-oneoff']")

  private val otherAmountButton = cssSelector(".form__radio-group-label[for='contributionAmount-other']")

  private val otherAmount = id("contributionOther")

  def pageHasLoaded: Boolean = {
    pageHasElement(contributeButton)
    elementIsClickable(contributeButton)
  }

  def clickContribute: Unit = clickOn(contributeButton)

  def clickOneOff: Unit = clickOn(oneOffButton)

  def clickContributePayPalButton: Unit = clickOn(contributePayPalButton)

  def clickOtherAmount: Unit = clickOn(otherAmountButton)

  def enterAmount(amount: Double): Unit = setValueSlowly(otherAmount, amount.toString)

}
