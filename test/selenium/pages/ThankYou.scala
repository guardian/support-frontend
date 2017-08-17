package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

object ThankYou extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/monthly-contributions/thankyou"

  private val thankYouHeader = id("qa-thank-you-message")

  def focusOnDefaultFrame: Unit = revertToDefaultFrame

  def pageHasLoaded: Boolean = pageHasElement(thankYouHeader) && pageHasUrl("/monthly-contributions/thankyou")

}
