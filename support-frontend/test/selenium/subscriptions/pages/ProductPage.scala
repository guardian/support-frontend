package selenium.subscriptions.pages

import org.scalatestplus.selenium.Page
import selenium.util.{Browser, Config}

trait ProductPage extends Page with Browser {
  def path: String
  def headerClassName: String
  def pageHasLoaded: Boolean = {
    pageHasElement(className(headerClassName)) && pageHasUrl(path)
  }
  val url = s"${Config.supportFrontendUrl}${path}"
}
