package selenium.subscriptions.pages

import org.openqa.selenium.{By, WebDriver}
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, TestUser}

class DigitalPackCheckout(implicit val webDriver: WebDriver) extends Page with Browser with CheckoutPage {

  val url = s"${Config.supportFrontendUrl}/subscribe/digital/checkout"

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

  def fillForm() {
    RegisterFields.fillInAddress()
  }

}
