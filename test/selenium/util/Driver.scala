package selenium.util

import io.github.bonigarcia.wdm.ChromeDriverManager
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.{Cookie, WebDriver}

object Driver {

  def apply(): WebDriver = driver

  private val driver: WebDriver = {
    ChromeDriverManager.getInstance().setup()
    new ChromeDriver()
  }

  def reset(): Unit = {
    driver.manage.deleteAllCookies()
    driver.get(Config.supportFrontendUrl)
  }

  def quit(): Unit = driver.quit()

  def addCookie(name: String, value: String): Unit = driver.manage.addCookie(new Cookie(name, value))

}
