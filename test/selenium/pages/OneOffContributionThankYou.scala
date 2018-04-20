package selenium.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

class OneOffContributionThankYou(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/contribute/one-off/thankyou"

  private val thankYouHeader = id("contributions-thank-you-page")

  def pageHasLoaded: Boolean = pageHasElement(thankYouHeader) && pageHasUrl("/contribute/one-off/thankyou")

}

