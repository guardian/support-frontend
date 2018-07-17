package selenium.pages

import org.scalatest.selenium.Page
import java.net.URLEncoder

import org.openqa.selenium.WebDriver
import selenium.util.{Browser, Config, TestUser}

case class RegisterPageOne(testUser: TestUser, amount: Int)(implicit val webDriver: WebDriver) extends Page with Browser {
  private val returnUrlParam = URLEncoder.encode(s"${Config.supportFrontendUrl}/contribute/recurring?contributionValue%3D${amount}", "UTF-8")
  val url = s"${Config.identityFrontendUrl}/signin/start?returnUrl=${returnUrlParam}&skipConfirmation=true&clientId=recurringContributions"

  def fillInPersonalDetails() { RegisterFields.fillIn() }

  def submit() { clickOn(submitButton) }

  def pageHasLoaded: Boolean = pageHasElement(submitButton)

  private object RegisterFields {
    val email = id("register_field_email")
    val password = id("register_field_password")

    def fillIn() {
      setValue(firstName, testUser.username, clear = true)
      setValue(lastName, testUser.username, clear = true)
      setValue(email, s"${testUser.username}@gu.com", clear = true)
      setValue(password, testUser.username, clear = true)
    }
  }

  private val submitButton = id("register_submit")
}
