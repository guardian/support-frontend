package selenium.contributions.new_flow.pages

import java.net.URLEncoder

import org.openqa.selenium.WebDriver
import org.scalatest.selenium.Page
import selenium.util.{Browser, Config, TestUser}

case class RegisterPageOne(testUser: TestUser, amount: Int)(implicit val webDriver: WebDriver) extends Page with Browser {
  private val returnUrlParam = URLEncoder.encode(s"${Config.supportFrontendUrl}/contribute/recurring?contributionValue%3D${amount}", "UTF-8")
  val url = s"${Config.identityFrontendUrl}/signin?returnUrl=${returnUrlParam}&skipConfirmation=true&clientId=recurringContributions"

  def fillInPersonalDetails() { RegisterFields.fillIn() }

  def submit() { clickOn(submitButton) }

  def pageHasLoaded: Boolean = pageHasElement(submitButton)

  private object RegisterFields {
    val email = id("tssf-email")

    def fillIn() {
      setValue(email, s"${testUser.username}@gu.com", clear = true)
    }
  }

  private val submitButton = id("tssf-submit")
}

