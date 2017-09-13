package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

object OneOffContributionThankYou extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/one-off/thankyou"

  private val thankYouHeader = id("qa-thank-you-message")

  def focusOnDefaultFrame: Unit = revertToDefaultFrame

  def pageHasLoaded: Boolean = pageHasElement(thankYouHeader) && pageHasUrl("/contribute/one-off/thankyou")

}

