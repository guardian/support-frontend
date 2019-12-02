package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Browser

class PaperProductPage(implicit val webDriver: WebDriver) extends Browser with ProductPage {

  override def path = s"/uk/subscribe/paper"

  override def elementQuery = className("component-heading-block")

}
