package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Config

class PaperCheckout(implicit val webDriver: WebDriver) extends CheckoutPage {

  val url = s"${Config.supportFrontendUrl}/subscribe/paper/checkout"

  private val deliveryLineOne = id("delivery-lineOne")
  private val deliveryCity = id("delivery-city")
  private val deliveryPostcode = id("delivery-postcode")

  private val billingLineOne = id("billing-lineOne")
  private val billingCity = id("billing-city")
  private val billingPostcode = id("billing-postcode")

  private val billingAddressIsDifferent = id("qa-billing-address-different")

  def fillForm(): Unit = {
    setValue(deliveryLineOne, "Kings Place")
    setValue(deliveryCity, "London")
    setValue(deliveryPostcode, "N19GU")
    clickOn(billingAddressIsDifferent)
    setValue(billingLineOne, "My house")
    setValue(billingCity, "Bristol")
    setValue(billingPostcode, "BS68QT")
  }

}
