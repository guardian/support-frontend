package selenium.subscriptions.pages

import org.scalatest.selenium.Page
import java.net.URLEncoder

import org.openqa.selenium.WebDriver
import selenium.util.{Browser, Config, TestUser}

case class Register(testUser: TestUser, checkoutType: String)(implicit val webDriver: WebDriver) extends Page with Browser {
  private val returnUrlParam = URLEncoder.encode(s"${Config.supportFrontendUrl}/subscribe/$checkoutType/checkout", "UTF-8")
  val url = s"${Config.identityFrontendUrl}/register?returnUrl=${returnUrlParam}&skipConfirmation=true&skipValidationReturn=true&clientId=subscriptions"

  def fillInPersonalDetails() { RegisterFields.fillIn() }

  def submit() { clickOn(submitButton) }

  def pageHasLoaded: Boolean = pageHasElement(submitButton)

  private object RegisterFields {
    val firstName = id("register_field_firstname")
    val lastName = id("register_field_lastname")
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
