package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatestplus.selenium.Page
import selenium.util.Browser

class SubsLandingPage(implicit val webDriver: WebDriver) extends Page with Browser with ProductPage {

  override def path = "/uk/subscribe"

  override def headerClassName = "#qa-subscriptions-landing-page"

}
