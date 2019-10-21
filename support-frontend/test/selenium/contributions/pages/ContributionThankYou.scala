package selenium.contributions.pages

import org.openqa.selenium.WebDriver
import org.scalatestplus.selenium.Page
import selenium.util.{Browser, Config}

class ContributionThankYou(region: String)(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/$region/thankyou"

  private val thankYouHeader = className("gu-content--contribution-thankyou")

  def pageHasLoaded: Boolean = {
    pageHasElement(thankYouHeader) && pageHasUrl(s"/$region/thankyou")
  }

}
