package selenium.subscriptions.pages

import org.scalatest.selenium.Page
import selenium.util.Browser

trait CheckoutPage extends Page with Browser {
  private val stripeRadioButton = id("qa-credit-card")
  private val submitButton = id("qa-submit-button")
  private val directDebitButton = id("qa-direct-debit")

  def selectStripePaymentMethod(): Unit = clickOn(stripeRadioButton)

  def selectDirectDebitPaymentMethod(): Unit = clickOn(directDebitButton)

  def pageHasLoaded: Boolean = {
    pageHasElement(submitButton)
    elementIsClickable(submitButton)
  }

  def thankYouPageHasLoaded: Boolean = {
    pageHasElement(className("thank-you-stage"))
  }

  def clickSubmit: Unit = clickOn(submitButton)

  def fillForm: Unit
}
