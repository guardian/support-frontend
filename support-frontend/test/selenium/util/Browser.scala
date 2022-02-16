package selenium.util

import com.typesafe.scalalogging.LazyLogging
import org.openqa.selenium.WebDriver
import org.openqa.selenium.support.ui.ExpectedConditions.numberOfWindowsToBe
import org.openqa.selenium.support.ui.{ExpectedCondition, ExpectedConditions, WebDriverWait}
import org.scalatestplus.selenium.WebBrowser

import scala.jdk.CollectionConverters._
import scala.util.Try

trait Browser extends WebBrowser with LazyLogging {

  implicit val webDriver: WebDriver

  // Stores a handle to the first window opened by the driver.
  lazy val parentWindow = webDriver.getWindowHandle

  def elementHasText(q: Query, text: String): Boolean =
    waitUntil(ExpectedConditions.textToBePresentInElementLocated(q.by, text))

  def pageHasElement(q: Query): Boolean =
    waitUntil(ExpectedConditions.visibilityOfElementLocated(q.by))

  // If there is more than 1 element matching the query then only one of them needs to be visible
  def pageHasAtLeastOneVisibleElement(q: Query): Boolean = {
    val elements = webDriver.findElements(q.by)
    logger.info(s"Visibility of element ${q.queryString}: ${elements.asScala.toList.map(_.isDisplayed)}")
    elements.asScala.exists(element => element.isDisplayed)
  }

  def elementIsClickable(q: Query): Boolean =
    waitUntil(ExpectedConditions.elementToBeClickable(q.by))

  def pageDoesNotHaveElement(q: Query): Boolean =
    waitUntil(ExpectedConditions.not(ExpectedConditions.presenceOfAllElementsLocatedBy(q.by)))

  def pageHasUrl(urlFraction: String): Boolean =
    waitUntil(ExpectedConditions.urlContains(urlFraction))

  def pageHasUrlOrElement(urlFraction: String, q: Query): Boolean =
    waitUntil(
      ExpectedConditions.or(
        ExpectedConditions.urlContains(urlFraction),
        ExpectedConditions.visibilityOfElementLocated(q.by),
      ),
    )

  def clickOn(q: Query): Unit = {
    if (pageHasElement(q))
      click.on(q)
    else
      throw new MissingPageElementException(q)
  }

  def setValue(q: Query, value: String, clear: Boolean = false): Unit = {
    if (pageHasElement(q)) {

      if (clear) q.webElement.clear
      q.webElement.sendKeys(value)

    } else
      throw new MissingPageElementException(q)
  }

  def clearValue(q: Query): Unit = {
    if (pageHasElement(q)) {

      q.webElement.clear

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

  def setSingleSelectionValue(q: Query, value: String): Unit = {
    if (pageHasElement(q))
      singleSel(q).value = value
    else
      throw new MissingPageElementException(q)
  }

  // Switches to a new iframe specified by the Query, q.
  def switchFrame(q: Query): Unit = {
    if (pageHasElement(q))
      webDriver.switchTo().frame(q.webElement)
    else
      throw new MissingPageElementException(q)
  }

  def switchToFrame(index: Int) = webDriver.switchTo().frame(index)

  def switchToParentFrame = webDriver.switchTo().defaultContent()

  // Switches to the first window in the list of windows that doesn't match the parent window.
  def switchWindow(): Unit = {
    waitUntil(numberOfWindowsToBe(2))
    for {
      winHandle <- webDriver.getWindowHandles.asScala
      if winHandle != parentWindow
    } webDriver.switchTo().window(winHandle)
  }

  def switchToParentWindow(): Unit = webDriver.switchTo().window(parentWindow)

  private def waitUntil[T](pred: ExpectedCondition[T]): Boolean =
    Try(new WebDriverWait(webDriver, Config.waitTimeout).until(pred)).isSuccess

  private case class MissingPageElementException(q: Query)
      extends Exception(s"Could not find WebElement with locator: ${q.queryString}")
}
