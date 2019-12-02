package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatestplus.selenium.Page
import selenium.util.Browser

class DigitalPackProductPage(implicit val webDriver: WebDriver) extends Page with Browser with ProductPage {

  override def path = "/uk/subscribe/digital"

  override def headerClassName = "component-footer"

}
