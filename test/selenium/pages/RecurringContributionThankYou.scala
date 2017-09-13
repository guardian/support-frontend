package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

object RecurringContributionThankYou extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/recurring/thankyou"

  private val thankYouHeader = id("qa-thank-you-message")

  def focusOnDefaultFrame: Unit = revertToDefaultFrame

  def pageHasLoaded: Boolean = pageHasElement(thankYouHeader) && pageHasUrl("/contribute/recurring/thankyou")

}
