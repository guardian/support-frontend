package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatestplus.selenium.Page
import selenium.util.Browser

class WeeklyProductPage(implicit val webDriver: WebDriver) extends Page with Browser with ProductPage {

  override def path = "/uk/subscribe/weekly"

  override def headerClassName = "component-heading-block"

}
