package selenium.util

import java.net.URL
import io.github.bonigarcia.wdm.ChromeDriverManager
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.remote.{DesiredCapabilities, RemoteWebDriver}
import org.openqa.selenium.{Cookie, WebDriver}

object Driver {

  def apply(): WebDriver = driver

  private lazy val driver: WebDriver =
    if (Config.webDriverRemoteUrl.isEmpty)
      instantiateLocalBrowser()
    else
      instantiateRemoteBrowser()

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
    driver.manage.deleteAllCookies()
    driver.get(Config.supportFrontendUrl)
  }

  def quit(): Unit = driver.quit()

  def addCookie(name: String, value: String): Unit = driver.manage.addCookie(new Cookie(name, value))

  val sessionId = driver.asInstanceOf[RemoteWebDriver].getSessionId.toString

}
