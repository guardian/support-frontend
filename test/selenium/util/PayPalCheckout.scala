package selenium.util

import selenium.pages.MonthlyContribution.{id, pageDoesNotHaveElement, switchToParentWindow}

// Handles interaction with the PayPal Express Checkout overlay.
object PayPalCheckout extends Browser {

  val container = name("injectedUl")
  val loginButton = name("btnLogin")
  val emailInput = name("login_email")
  val passwordInput = name("login_password")
  val agreeAndPay = id("confirmButtonTop")
  val paymentAmount = className("formatCurrency")

  def fillIn(): Unit = {
    setValueSlowly(emailInput, Config.paypalBuyerEmail)
    setValueSlowly(passwordInput, Config.paypalBuyerPassword)
  }

  def logIn(): Unit = clickOn(loginButton)

  def acceptPayment(): Unit = clickOn(agreeAndPay)

  def payPalHasPaymentSummary(): Boolean = pageHasElement(PayPalCheckout.agreeAndPay)

  def payPalSummaryHasCorrectDetails(expectedCurrencyAndAmount: String): Boolean = elementHasText(PayPalCheckout.paymentAmount, expectedCurrencyAndAmount)

  def hasLoaded: Boolean = pageHasElement(PayPalCheckout.loginButton)

  def switchToPayPalPage(): Unit = {
    switchFrame(PayPalCheckout.container)
  }

  def acceptPayPalPaymentPage(): Unit = {
    pageDoesNotHaveElement(id("spinner"))
    PayPalCheckout.acceptPayment
  }

  def switchToPayPalPopUp(): Unit = {
    switchWindow
    switchFrame(PayPalCheckout.container)
  }

  def acceptPayPalPaymentPopUp(): Unit = {
    pageDoesNotHaveElement(id("spinner"))
    PayPalCheckout.acceptPayment
    switchToParentWindow
  }
}