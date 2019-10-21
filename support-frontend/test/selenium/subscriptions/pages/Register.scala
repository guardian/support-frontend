package selenium.subscriptions.pages

import org.scalatestplus.selenium.Page
import java.net.URLEncoder

import org.openqa.selenium.WebDriver
import selenium.util.{Browser, Config, PostDeployTestUser}

case class Register(testUser: PostDeployTestUser, checkoutType: String)(implicit val webDriver: WebDriver) extends Page with Browser {
  private val returnUrlParam = URLEncoder.encode(s"${Config.supportFrontendUrl}/subscribe/$checkoutType/checkout", "UTF-8")
  val url = s"${Config.identityFrontendUrl}/register?returnUrl=$returnUrlParam&skipConfirmation=true&skipValidationReturn=true&clientId=subscriptions"

  def fillInEmail() { RegisterFields.fillInEmail() }

  def fillInPersonalDetails() { RegisterFields.fillInPersonalDetails() }

  def next() { clickOn(nextButton) }

  def createAccount() { clickOn(createAccountButton) }

  def firstPageHasLoaded: Boolean = pageHasElement(nextButton)

  def secondPageHasLoaded: Boolean = pageHasElement(createAccountButton)

  private object RegisterFields {
    val firstName = id("register_field_firstname")
    val lastName = id("register_field_lastname")
    val email = id("tssf-email")
    val password = id("register_field_password")

    def fillInEmail(): Unit = {
      setValue(email, s"${testUser.username}@gu.com", clear = true)
    }

    def fillInPersonalDetails() {
      setValue(firstName, testUser.username, clear = true)
      setValue(lastName, testUser.username, clear = true)
      setValue(password, testUser.username, clear = true)
    }
  }

  private val nextButton = id("tssf-submit")
  private val createAccountButton = id("tssf-create-account")
}
