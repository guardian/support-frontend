package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import selenium.util.Browser

class SubsLandingPage(implicit val webDriver: WebDriver) extends Browser with ProductPage {

  override def path = "/uk/subscribe"

  override def elementQuery = id("qa-subscriptions-landing-page")

}
