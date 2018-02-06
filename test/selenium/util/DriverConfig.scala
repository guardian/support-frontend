package selenium.util

import java.net.URL
import java.util.Date

import io.github.bonigarcia.wdm.ChromeDriverManager
import org.joda.time.DateTime
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.remote.{DesiredCapabilities, RemoteWebDriver}
import org.openqa.selenium.{Cookie, WebDriver}

class DriverConfig {

  implicit val webDriver: WebDriver = createDriver

  def createDriver: WebDriver =
    if (Config.webDriverRemoteUrl.isEmpty) {
      instantiateLocalBrowser()
    } else {
      println(s"Configuring driver at ${DateTime.now}")
      val driver = instantiateRemoteBrowser()
      println(s"Finished configuring driver at ${DateTime.now}")
      driver
    }

  // Used in dev to run tests locally
  private def instantiateLocalBrowser(): WebDriver = {
    ChromeDriverManager.getInstance().setup()
    new ChromeDriver()
  }

  // Used by Travis to run tests in SauceLabs
  private def instantiateRemoteBrowser(): WebDriver = {
    val caps = DesiredCapabilities.chrome()
    caps.setCapability("platform", "Windows 8.1")
    caps.setCapability("name", "support-frontend")
    new RemoteWebDriver(new URL(Config.webDriverRemoteUrl), caps)
  }

  def reset(): Unit = {
    webDriver.get(Config.paypalSandbox)
    webDriver.manage.deleteAllCookies()

    webDriver.get(Config.contributionFrontend)
    webDriver.manage.deleteAllCookies()

    webDriver.get(Config.identityFrontendUrl)
    webDriver.manage.deleteAllCookies()

    webDriver.get(Config.supportFrontendUrl + "/uk")
    webDriver.manage.deleteAllCookies()
  }

  def quit(): Unit = webDriver.quit()

  def addCookie(name: String, value: String, domain: Option[String] = None, path: String = "/", date: Option[Date] = None): Unit = {
    webDriver.manage.addCookie(new Cookie(name, value, domain.orNull, path, date.orNull))
  }

  val sessionId = webDriver.asInstanceOf[RemoteWebDriver].getSessionId.toString

}
