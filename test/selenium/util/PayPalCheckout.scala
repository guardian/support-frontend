package selenium.util

import java.time.ZoneOffset
import java.util.Date
import org.openqa.selenium.WebDriver
import selenium.pages.ContributionsLanding

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

  def addPaypalCookie()(implicit landing: ContributionsLanding): Unit = {
    val cookieName: String = "tsrce"
    val cookieValue: String = "authchallengenodeweb"
    val path: String = "/"
    val domain: String = ".paypal.com"
    val isSecure: Boolean = true

    /*Note: The very convoluted creation of the expiry Date is due to the fact that
    most of the creation methods for Date.java are deprecated. */
    val expiry = java.time.LocalDateTime.now().plusMonths(1)
    val expiryAsInstant = expiry.toInstant(ZoneOffset.MIN)
    val expiryAsDate = Date.from(expiryAsInstant)

    landing.addCookie(cookieName, cookieValue, path, expiryAsDate, domain, isSecure)
  }

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
}