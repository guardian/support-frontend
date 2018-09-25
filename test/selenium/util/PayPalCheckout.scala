package selenium.util

import org.openqa.selenium.WebDriver

// Handles interaction with the PayPal Express Checkout overlay.
class PayPalCheckout(implicit val webDriver: WebDriver) extends Browser {

  val container = name("injectedUl")
  val loginButton = name("btnLogin")
  val nextButton = name("btnNext")
  val emailInput = name("login_email")
  val passwordInput = name("login_password")
  val agreeAndPay = id("confirmButtonTop")
  val paymentAmount = className("formatCurrency")
  val guestRegistrationUrlFragment = "#/checkout/guest"
  val loginUrlFragment = "https://www.sandbox.paypal.com/webapps/hermes?country.x=US&hermesLoginRedirect=xoon&locale.x=en_US"

  def clickNext(): Unit = clickOn(nextButton)

  def logIn(): Unit = clickOn(loginButton)

  def acceptPayment(): Unit = {
    pageHasElement(agreeAndPay)
    elementIsClickable(agreeAndPay)
    clickOn(agreeAndPay)
  }

  def payPalHasPaymentSummary(): Boolean = pageHasElement(agreeAndPay)

  def payPalSummaryHasCorrectDetails(expectedCurrencyAndAmount: String): Boolean = elementHasText(paymentAmount, expectedCurrencyAndAmount)

  def initialPageHasLoaded: Boolean = {
    pageHasUrlOrElement(guestRegistrationUrlFragment, emailInput)
  }

  def loginContainerHasLoaded: Boolean = {
    pageHasElement(emailInput)
  }

  def switchToPayPalPage(): Unit = {
    switchFrame(container)
  }

  def acceptPayPalPaymentPage(): Unit = {
    pageDoesNotHaveElement(id("spinner"))
    acceptPayment()
  }

  def switchToPayPalPopUp(): Unit = {
    switchWindow()
  }

  def acceptPayPalPaymentPopUp(): Unit = {
    pageDoesNotHaveElement(id("spinner"))
    acceptPayment()
    switchToParentWindow()
  }

  def handleGuestRegistrationPage(): Unit = {
    val url = webDriver.getCurrentUrl
    if (url.contains(guestRegistrationUrlFragment)) {
      val token = url.substring(url.indexOf("&token="), url.indexOf(guestRegistrationUrlFragment))
      webDriver.navigate().to(loginUrlFragment + token)
    }
  }

  def enterLoginDetails(): Unit = {
    setValueSlowly(emailInput, Config.paypalBuyerEmail)
    if (pageHasElement(nextButton)) {
      clickNext()
    }
    if (pageHasElement(loginButton)) {
      setValueSlowly(passwordInput, Config.paypalBuyerPassword)
    }
  }
}