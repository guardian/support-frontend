package selenium.util

import java.net.URL
import java.util.Date
import io.github.bonigarcia.wdm.WebDriverManager
import org.openqa.selenium.chrome.{ChromeDriver, ChromeOptions}
import org.openqa.selenium.remote.RemoteWebDriver
import org.openqa.selenium.{Cookie, JavascriptExecutor, WebDriver}

import scala.collection.immutable.HashMap

class DriverConfig {

  implicit val webDriver: WebDriver = createDriver

  def createDriver: WebDriver =
    if (Config.webDriverRemoteUrl.isEmpty)
      instantiateLocalBrowser()
    else
      instantiateRemoteBrowser()

  // Used in dev to run tests locally
  private def instantiateLocalBrowser(): WebDriver = {
    WebDriverManager.chromedriver().setup()
    new ChromeDriver()
  }

  // Used by Travis to run tests in BrowserStack
  // See: https://www.browserstack.com/automate/java#getting-started
  private def instantiateRemoteBrowser(): WebDriver = {
    val chromeOptions = new ChromeOptions
    chromeOptions.setCapability("platform", "WINDOWS")
    chromeOptions.setCapability("name", "support-frontend")

    val networkLogsOptions = HashMap("captureContent" -> true)
    chromeOptions.setCapability("browserstack.networkLogs", true)
    chromeOptions.setCapability("browserstack.networkLogsOptions", networkLogsOptions)

    new RemoteWebDriver(new URL(Config.webDriverRemoteUrl), chromeOptions)
  }

  def reset(): Unit = {

    webDriver.get(Config.supportFrontendUrl + "/uk")
    webDriver.manage.deleteAllCookies()

    webDriver.asInstanceOf[JavascriptExecutor].executeScript("window.localStorage.clear();")
  }

  def quit(): Unit = webDriver.quit()

  def addCookie(
      name: String,
      value: String,
      domain: Option[String] = None,
      path: String = "/",
      date: Option[Date] = None,
  ): Unit = {
    webDriver.manage.addCookie(new Cookie(name, value, domain.orNull, path, date.orNull))
  }

  val sessionId = webDriver.asInstanceOf[RemoteWebDriver].getSessionId

}
