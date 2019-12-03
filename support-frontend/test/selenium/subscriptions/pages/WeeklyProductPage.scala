package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Browser

class WeeklyProductPage(implicit val webDriver: WebDriver) extends Browser with ProductPage {

  override def path = "/uk/subscribe/weekly"

  override def elementQuery = className("component-heading-block")

}
