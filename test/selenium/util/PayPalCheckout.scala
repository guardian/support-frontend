package selenium.util

import org.openqa.selenium.WebDriver
import play.api.test.FutureAwaits

// Handles interaction with the PayPal Express Checkout overlay.
class PayPalCheckout(implicit val webDriver: WebDriver) extends Browser {

  val container = name("injectedUl")
  val loginButton = name("btnLogin")
  val nextButton = name("btnNext")
  val emailField = id("login_emaildiv")
  val emailInput = name("login_email")
  val passwordInput = name("login_password")
  val agreeAndPay = id("confirmButtonTop")
  val paymentAmount = className("formatCurrency")

  def fillIn(): Unit = {
    setValueSlowly(emailInput, Config.paypalBuyerEmail)
    if (pageHasElement(nextButton)) {
      clickNext()
    }
    if (pageHasElement(loginButton)) {
      setValueSlowly(passwordInput, Config.paypalBuyerPassword)
    }
  }

  def clickNext(): Unit = clickOn(nextButton)

  def logIn(): Unit = clickOn(loginButton)

  def acceptPayment(): Unit = clickOn(agreeAndPay)

  def payPalHasPaymentSummary(): Boolean = pageHasElement(agreeAndPay)

  def payPalSummaryHasCorrectDetails(expectedCurrencyAndAmount: String): Boolean = elementHasText(paymentAmount, expectedCurrencyAndAmount)

  def hasLoaded: Boolean = {
    pageHasElement(emailField)
  }

  def switchToPayPalPage(): Unit = {
    switchFrame(container)
  }

  def acceptPayPalPaymentPage(): Unit = {
    pageDoesNotHaveElement(id("spinner"))
    acceptPayment
  }

  def switchToPayPalPopUp(): Unit = {
    switchWindow
    switchFrame(container)
  }

  def acceptPayPalPaymentPopUp(): Unit = {
    pageDoesNotHaveElement(id("spinner"))
    acceptPayment
    switchToParentWindow
  }
}