package selenium.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

class RecurringContributionThankYou(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/recurring/thankyou"

  private val thankYouHeader = id("qa-thank-you-message")

  def pageHasLoaded: Boolean = pageHasElement(thankYouHeader) && (pageHasUrl("/contribute/recurring/thankyou") || pageHasUrl("/contribute/recurring/pending"))

}
