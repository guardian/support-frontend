package selenium.subscriptions.pages

import org.openqa.selenium.WebDriver
import org.scalatestplus.selenium.Page
import selenium.util.{Browser, Config}

class DirectDebitForm(implicit val webDriver: WebDriver) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/subscribe/digital/checkout"

  private val submitButton1 = id("qa-submit-button-1")
  private val submitButton2 = id("qa-submit-button-2")
  private val accountName = id("account-holder-name-input")
  private val accountNumber = id("account-number-input")
  private val sortCode1 = id("qa-sort-code-1")
  private val sortCode2 = id("qa-sort-code-2")
  private val sortCode3 = id("qa-sort-code-3")
  private val confirmationCheckBox = id("qa-confirmation-input")

  def fillForm {
    setValue(accountName, "Test user")
    setValue(accountNumber, "55779911")
    setValue(sortCode1, "20")
    setValue(sortCode2, "20")
    setValue(sortCode3, "20")
    clickOn(confirmationCheckBox)
    clickOn(submitButton1)
  }

  def pageHasLoaded(): Boolean = pageHasElement(submitButton1)

  def secondPageHasLoaded: Boolean = pageHasElement(submitButton2)

  def confirm: Unit = clickOn(submitButton2)

}
