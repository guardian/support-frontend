package selenium.subscriptions.pages

import org.scalatestplus.selenium.Page
import selenium.util.Browser

trait CheckoutPage extends Page with Browser {
  private val submitButton = id("qa-submit-button")
  private val personalDetails = id("qa-personal-details")

  // Stripe
  private val stripeRadioButton = id("qa-credit-card")
  private val stripeSubmitButton = id("qa-stripe-submit-button")
  private val cardNumber = name("cardnumber")
  private val expiry = name("exp-date")
  private val cvc = name("cvc")
  private val recaptchaButton = id("robot_checkbox")

  // Direct debit
  private val directDebitButton = id("qa-direct-debit")
  private val accountName = id("account-holder-name-input")
  private val sortCode = id("sort-code-input")
  private val accountNumber = id("account-number-input")
  private val accountConfirmation = id("account-holder-confirmation")
  private val directDebitSubmitButton = id("qa-direct-debit-submit")
  private val directDebitPlaybackSubmit = id("qa-submit-button-2")

  def selectStripePaymentMethod(): Unit = clickOn(stripeRadioButton)

  def selectDirectDebitPaymentMethod(): Unit = clickOn(directDebitButton)

  def clickRecaptcha: Unit = {
    clickOn(recaptchaButton)
    waitForTestRecaptchaToComplete
  }

  def pageHasLoaded: Boolean = {
    pageHasElement(personalDetails)
  }

  def stripeFormHasLoaded: Boolean = {
    switchToFrame(0)
    pageHasElement(cardNumber)
  }

  def directDebitFormHasLoaded: Boolean = {
    pageHasElement(accountNumber)
  }

  def directDebitPlaybackHasLoaded: Boolean = {
    pageHasElement(directDebitPlaybackSubmit)
  }

  def fillStripeForm(): Unit = {
    for (_ <- 1 to 8) setValue(cardNumber, "42")
    switchToParentFrame
    switchToFrame(1)
    setValue(expiry, "12")
    setValue(expiry, "50")
    switchToParentFrame
    switchToFrame(2)
    setValue(cvc, "123")
    switchToParentFrame
    clickRecaptcha
  }

  def waitForTestRecaptchaToComplete: Unit = Thread.sleep(1000)

  def fillDirectDebitForm(): Unit = {
    setValue(accountName, "Test user")
    setValue(sortCode, "200000")
    setValue(accountNumber, "55779911")
    clickOn(accountConfirmation)
  }

  def thankYouPageHasLoaded: Boolean = {
    pageHasElement(className("thank-you-stage"))
  }

  def clickSubmit(): Unit = clickOn(submitButton)

  def clickStripeSubmit(): Unit = clickOn(stripeSubmitButton)

  def clickDirectDebitConfirm(): Unit = clickOn(directDebitSubmitButton)

  def clickDirectDebitPay(): Unit = {
    clickRecaptcha
    clickOn(directDebitPlaybackSubmit)
  }

  def fillForm(): Unit
}
