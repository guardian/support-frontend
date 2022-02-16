package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Config

class GuardianWeeklyCheckout(implicit val webDriver: WebDriver) extends CheckoutPage {

  val url = s"${Config.supportFrontendUrl}/subscribe/weekly/checkout"

  private val deliveryLineOne = id("delivery-lineOne")
  private val deliveryCity = id("delivery-city")
  private val deliveryPostcode = id("delivery-postcode")
  private val deliveryCountry = id("delivery-country")

  private val billingAddressIsDifferent = id("qa-billing-address-different")
  private val billingLineOne = id("billing-lineOne")
  private val billingCity = id("billing-city")
  private val billingState = id("billing-stateProvince")
  private val billingPostcode = id("billing-postcode")
  private val billingCountry = id("billing-country")

  def fillForm(): Unit = {
    setValue(deliveryCountry, "United Kingdom")
    setValue(deliveryLineOne, "Kings Place")
    setValue(deliveryCity, "London")
    setValue(deliveryPostcode, "N19GU")
    clickOn(billingAddressIsDifferent)
    setValue(billingCountry, "India")
    setValue(billingLineOne, "Red Fort")
    setValue(billingCity, "New Delhi")
    setValue(billingState, "Delhi")
    setValue(billingPostcode, "110006")
  }

}
