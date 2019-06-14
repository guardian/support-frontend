package selenium.subscriptions.pages

import org.openqa.selenium.{By, WebDriver}
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, TestUser}

class DigitalPackCheckout(testUser: TestUser)(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/subscribe/digital/checkout"

  private val submitButton = id("qa-submit-button")
  private val stripeSelector = id("qa-credit-card")

  private object RegisterFields {
    private val addressLineOne = id("billing-lineOne")
    private val city = id("billing-city")
    private val postcode = id("billing-postcode")

    def fillInAddress() {
      setValue(addressLineOne, "Kings Place")
      setValue(city, "London")
      setValue(postcode, "N19GU")
    }
  }

  def fillInAddress() {
    RegisterFields.fillInAddress()
  }

  def selectStripePayment(): Unit =  clickOn(stripeSelector)

  def pageHasLoaded: Boolean = {
    pageHasElement(submitButton)
    elementIsClickable(submitButton)
  }

  def thankYouPageHasLoaded: Boolean = {
    pageHasElement(className("thank-you-stage"))
  }


  def clickSubmit: Unit = clickOn(submitButton)
}
