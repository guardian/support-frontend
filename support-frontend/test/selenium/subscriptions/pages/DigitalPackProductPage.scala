package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

class DigitalPackProductPage(implicit val webDriver: WebDriver) extends Page with Browser with ProductPage {

  val url = s"${Config.supportFrontendUrl}/uk/subscribe/digital"

  private val header = className("component-heading-block")

  def pageHasLoaded: Boolean = {
    pageHasElement(header) && pageHasUrl(s"/uk/subscribe/digital")
    pageHasElement(subscriptionsButton)
    elementIsClickable(subscriptionsButton)
  }

  def clickSubscriptionOptions: Unit = {
    clickOn(subscriptionsButton)
  }

  def hasScrolledToSubscriptionOptions: Boolean = {
    pageHasElement(monthlyButton)
    elementIsClickable(monthlyButton)
  }

  def clickMonthly: Unit = clickOn(monthlyButton)

  private val monthlyButton = id("qa-monthly")

  private val subscriptionsButton = id("qa-subscription-options")

}
