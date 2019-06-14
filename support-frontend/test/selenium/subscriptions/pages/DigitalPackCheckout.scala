package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Config

class DigitalPackCheckout(implicit val webDriver: WebDriver) extends CheckoutPage {

  val url = s"${Config.supportFrontendUrl}/subscribe/digital/checkout"

  private val addressLineOne = id("billing-lineOne")
  private val city = id("billing-city")
  private val postcode = id("billing-postcode")

  def fillForm {
    setValue(addressLineOne, "Kings Place")
    setValue(city, "London")
    setValue(postcode, "N19GU")
  }

}
