package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

class PaperSubs(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/uk/subscribe/paper"

  private val header = className("component-heading-block")

  def pageHasLoaded: Boolean = {
    pageHasElement(header)
  }

}
