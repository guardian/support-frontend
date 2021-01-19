package selenium.util

import java.net.URL
import java.util.Date

import io.github.bonigarcia.wdm.{ChromeDriverManager, WebDriverManager}
import org.openqa.selenium.chrome.{ChromeDriver, ChromeOptions}
import org.openqa.selenium.remote.RemoteWebDriver
import org.openqa.selenium.{Cookie, JavascriptExecutor, WebDriver}

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
    val driver = new ChromeDriver()
    val dev = new java.util.HashMap[String, Object]()
    dev.put("timezoneId", "America/New_York")
    val devTools = driver.getDevTools
    devTools.createSession
    driver.executeCdpCommand("Emulation.setTimezoneOverride", dev)
    driver
  }

  // Used by Travis to run tests in BrowserStack
  // See: https://www.browserstack.com/automate/java#getting-started
  private def instantiateRemoteBrowser(): WebDriver = {
    val chromeOptions = new ChromeOptions
    chromeOptions.setCapability("platform", "WINDOWS")
    chromeOptions.setCapability("name", "support-frontend")
//    chromeOptions.setCapability("browserstack.networkLogs", "true")
    chromeOptions.setCapability("browserstack.timezone", "New_York")
    new RemoteWebDriver(new URL(Config.webDriverRemoteUrl), chromeOptions)
  }

  def reset(): Unit = {

    webDriver.get(Config.identityFrontendUrl)
    webDriver.manage.deleteAllCookies()

    webDriver.get(Config.supportFrontendUrl + "/uk")
    webDriver.manage.deleteAllCookies()

    webDriver.asInstanceOf[JavascriptExecutor].executeScript("window.localStorage.clear();")
  }

  def quit(): Unit = webDriver.quit()

  def addCookie(name: String, value: String, domain: Option[String] = None, path: String = "/", date: Option[Date] = None): Unit = {
    webDriver.manage.addCookie(new Cookie(name, value, domain.orNull, path, date.orNull))
  }

  val sessionId = webDriver.asInstanceOf[RemoteWebDriver].getSessionId

}
