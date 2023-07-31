package selenium.subscriptions.pages

import org.scalatestplus.selenium.Page
import selenium.util.{Browser, Config}

trait ProductPage extends Page with Browser {
  def path: String
  def elementQuery: Query
  def pageHasLoaded: Boolean = {
    Console.println("elementQuery-pageHasLoaded", elementQuery)
    Console.println("path-pageHasLoaded", path)
    pageHasElement(elementQuery) && pageHasUrl(path)
  }
  val url = s"${Config.supportFrontendUrl}$path"
}
