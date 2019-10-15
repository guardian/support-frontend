package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatestplus.selenium.Page
import selenium.util.{Browser, Config}

class PaperProductPage(implicit val webDriver: WebDriver) extends Page with Browser with ProductPage {

  val url = s"${Config.supportFrontendUrl}/uk/subscribe/paper"

  private val header = className("component-heading-block")

  def pageHasLoaded: Boolean = {
    pageHasElement(header) && pageHasUrl(s"/uk/subscribe/paper")
  }

}
