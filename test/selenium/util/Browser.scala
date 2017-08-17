package selenium.util

import org.openqa.selenium.support.ui.{ExpectedCondition, ExpectedConditions, WebDriverWait}
import org.scalatest.selenium.WebBrowser
import scala.util.Try

trait Browser extends WebBrowser {

  lazy implicit val webDriver = Driver()

  // Stores a handle to the first window opened by the driver.
  lazy val parentWindow = webDriver.getWindowHandle

  def pageHasElement(q: Query): Boolean =
    waitUntil(ExpectedConditions.visibilityOfElementLocated(q.by))

  def pageHasUrl(urlFraction: String): Boolean =
    waitUntil(ExpectedConditions.urlContains(urlFraction))

  def clickOn(q: Query) {
    if (pageHasElement(q))
      click.on(q)
    else
      throw new MissingPageElementException(q)
  }

  def setValue(q: Query, value: String, clear: Boolean = false) {
    if (pageHasElement(q)) {

      if (clear) q.webElement.clear
      q.webElement.sendKeys(value)

    } else
      throw new MissingPageElementException(q)
  }

  // Unfortunately this seems to be required in order to complete 3rd party payment forms
  def setValueSlowly(q: Query, value: String): Unit = {
    for {
      c <- value
    } yield {
      setValue(q, c.toString)
      Thread.sleep(100)
    }
  }

  // Switches to a new iframe specified by the Query, q.
  def switchFrame(q: Query) {
    if (pageHasElement(q))
      webDriver.switchTo().frame(q.webElement)
    else
      throw new MissingPageElementException(q)
  }

  def revertToDefaultFrame: Unit = webDriver.switchTo().defaultContent()

  private def waitUntil[T](pred: ExpectedCondition[T]): Boolean =
    Try(new WebDriverWait(webDriver, Config.waitTimeout).until(pred)).isSuccess

  private case class MissingPageElementException(q: Query)
    extends Exception(s"Could not find WebElement with locator: ${q.queryString}")
}
