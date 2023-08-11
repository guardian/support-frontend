package selenium.subscriptions.pages

import org.openqa.selenium.{Cookie, WebDriver}
import org.scalatestplus.selenium.Page
import selenium.util._

/** Signing in on the profile subdomain drops the appropriate auth cookies there. This means that when we go through the
  * auth flow on page load in the support subdomain the response gives us identity and access tokens which are then
  * dropped into cookies on the support subdomain.
  */
class SignInPage(implicit val webDriver: WebDriver) extends Page with Browser {

  override val url: String = s"${Config.identityGatewayUrl}/signin"

  private def disableConsentBanner(): Unit = {
    webDriver.manage.addCookie(new Cookie("gu-cmp-disabled", "true", "/", null))
    goTo(url)
  }

  def isAlreadySignedIn: Boolean = elementHasTextImmediately(tagName("section"), "You are signed in")

  def signIn(): Unit = {
    if (!isAlreadySignedIn) {
      disableConsentBanner()
      setValue(cssSelector("input[type=email]"), Config.testUserEmailAddress)
      setValue(cssSelector("input[type=password]"), Config.testUserPassword)
      val submitButton = cssSelector("[data-cy=main-form-submit-button]")
      clickOn(submitButton)
      pageDoesNotHaveElement(submitButton)
      Thread.sleep(100)
    }
  }
}
