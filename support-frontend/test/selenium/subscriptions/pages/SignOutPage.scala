package selenium.subscriptions.pages

import org.openqa.selenium.{Cookie, WebDriver}
import org.scalatestplus.selenium.Page
import selenium.util.{Browser, Config}

class SignOutPage(implicit val webDriver: WebDriver) extends Page with Browser {

  override val url: String = s"${Config.identityGatewayUrl}/signout"

}
