package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

class PaperCheckout (implicit val webDriver: WebDriver) extends Page with Browser with CheckoutPage {

  val url = s"${Config.supportFrontendUrl}/subscribe/paper/checkout"

  private object RegisterFields {
    private val deliveryLineOne = id("delivery-lineOne")
    private val deliveryCity = id("delivery-city")
    private val deliveryPostcode = id("delivery-postcode")

    private val addressLineOne = id("billing-lineOne")
    private val city = id("billing-city")
    private val postcode = id("billing-postcode")

    private val billingAddressIsSame = id("qa-billing-address-same")

    def fillInAddress() {
      setValue(deliveryLineOne, "Kings Place")
      setValue(deliveryCity, "London")
      setValue(deliveryPostcode, "N19GU")
      clickOn(billingAddressIsSame)
    }
  }

  def fillForm() {
    RegisterFields.fillInAddress()
  }

}
