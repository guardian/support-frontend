package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

class SubsLandingPage(implicit val webDriver: WebDriver) extends Page with Browser with ProductPage {

  val url = s"${Config.supportFrontendUrl}/uk/subscribe"

  private val header = cssSelector("#qa-subscriptions-landing-page")

  def pageHasLoaded: Boolean = {
    pageHasElement(header) && pageHasUrl(s"/uk/subscribe")
  }

}
