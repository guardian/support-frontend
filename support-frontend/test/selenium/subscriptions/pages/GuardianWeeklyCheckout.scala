package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Config

class GuardianWeeklyCheckout(implicit val webDriver: WebDriver) extends CheckoutPage {

  val url = s"${Config.supportFrontendUrl}/subscribe/weekly/checkout"

  private val deliveryLineOne = id("delivery-lineOne")
  private val deliveryCity = id("delivery-city")
  private val deliveryPostcode = id("delivery-postcode")
  private val deliveryCountry = id("delivery-country")
  private val deliveryState = id("delivery-stateProvince")

  private val giftCheckbox = id("qa-gift-checkbox")
  private val giftFirstName = id("firstNameGiftRecipient")
  private val giftLastName = id("lastNameGiftRecipient")

  private val billingAddressIsDifferent = id("qa-billing-address-different")
  private val billingLineOne = id("billing-lineOne")
  private val billingCity = id("billing-city")
  private val billingPostcode = id("billing-postcode")
  private val billingCountry = id("billing-country")

  def fillForm {
    clickOn(giftCheckbox)
    setValue(deliveryCountry, "India")
    setValue(deliveryLineOne, "Red Fort")
    setValue(deliveryCity, "New Delhi")
    setValue(deliveryState, "Delhi")
    setValue(deliveryPostcode, "110006")
    setValue(giftFirstName, "Gifty")
    setValue(giftLastName, "McGiftface")
    clickOn(billingAddressIsDifferent)
    setValue(billingCountry, "United Kingdom")
    setValue(billingLineOne, "Kings Place")
    setValue(billingCity, "London")
    setValue(billingPostcode, "N19GU")
  }

}
