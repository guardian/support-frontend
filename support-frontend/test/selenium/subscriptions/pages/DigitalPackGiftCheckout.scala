package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Config

class DigitalPackGiftCheckout(implicit val webDriver: WebDriver) extends CheckoutPage {
  val url = s"${Config.supportFrontendUrl}/subscribe/digital/checkout/gift"

  private val giftRecipientFirstName = id("firstNameGiftRecipient")
  private val giftRecipientLastName = id("lastNameGiftRecipient")
  private val giftRecipientEmail = id("emailGiftRecipient")

  private val addressLineOne = id("billing-lineOne")
  private val city = id("billing-city")
  private val postcode = id("billing-postcode")

  def fillForm(): Unit = {
    setValue(giftRecipientFirstName, "CP")
    setValue(giftRecipientLastName, "Scott")
    setValue(giftRecipientEmail, "cp.scott@gu.com")
    setValue(addressLineOne, "Kings Place")
    setValue(city, "London")
    setValue(postcode, "N19GU")
  }
}
