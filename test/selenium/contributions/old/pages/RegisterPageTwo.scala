package selenium.contributions.old.pages

import org.scalatest.selenium.Page
import java.net.URLEncoder

import org.openqa.selenium.WebDriver
import selenium.util.{Browser, Config, TestUser}

case class RegisterPageTwo(testUser: TestUser, amount: Int)(implicit val webDriver: WebDriver) extends Page with Browser {
  private val returnUrlParam = URLEncoder.encode(s"${Config.supportFrontendUrl}/contribute/recurring?contributionValue%3D${amount}", "UTF-8")
  val url = s"${Config.identityFrontendUrl}/signin/start?returnUrl=${returnUrlParam}&skipConfirmation=true&clientId=recurringContributions"

  def fillInPersonalDetails() { RegisterFields.fillIn() }

  def submit() { clickOn(submitButton) }

  def pageHasLoaded: Boolean = pageHasElement(submitButton)

  private object RegisterFields {
    val firstName = id("register_field_firstname")
    val lastName = id("register_field_lastname")
    val password = name("password")

    def fillIn() {
      setValue(firstName, testUser.username, clear = true)
      setValue(lastName, testUser.username, clear = true)
      setValue(password, testUser.username, clear = true)
    }
  }

  private val submitButton = id("tssf-create-account")
}
