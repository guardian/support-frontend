package selenium.subscriptions.pages

import org.scalatestplus.selenium.Page
import selenium.util.Browser

trait CheckoutPage extends Page with Browser {
  private val stripeRadioButton = id("qa-credit-card")
  private val submitButton = id("qa-submit-button")
  private val stripeSubmitButton = id("qa-stripe-submit-button")
  private val directDebitButton = id("qa-direct-debit")
  private val personalDetails = id("qa-personal-details")
  private val cardNumber = name("cardnumber")
  private val expiry = name("exp-date")
  private val cvc = name("cvc")

  def selectStripePaymentMethod(): Unit = clickOn(stripeRadioButton)

  def selectDirectDebitPaymentMethod(): Unit = clickOn(directDebitButton)

  def pageHasLoaded: Boolean = {
    pageHasElement(personalDetails)
  }

  def stripeFormHasLoaded: Boolean = {
    switchToFrame(0)
    pageHasElement(cardNumber)
  }

  def fillStripeForm: Unit = {
    for (_ <- 1 to 8) setValue(cardNumber, "42")
    switchToParentFrame
    switchToFrame(1)
    setValue(expiry, "12")
    setValue(expiry, "21")
    switchToParentFrame
    switchToFrame(2)
    setValue(cvc, "123")
    switchToParentFrame
  }

  def thankYouPageHasLoaded: Boolean = {
    pageHasElement(className("thank-you-stage"))
  }

  def clickSubmit(): Unit = clickOn(submitButton)

  def clickStripeSubmit(): Unit = clickOn(stripeSubmitButton)

  def fillForm(): Unit
}
