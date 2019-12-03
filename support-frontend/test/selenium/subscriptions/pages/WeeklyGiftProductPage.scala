package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Browser

class WeeklyGiftProductPage(implicit val webDriver: WebDriver) extends Browser with ProductPage {

  override def path = "/uk/subscribe/weekly/gift"

  override def elementQuery = className("weekly-campaign-hero")

}
