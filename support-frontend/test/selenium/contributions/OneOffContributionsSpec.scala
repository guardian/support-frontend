package selenium.contributions

import org.openqa.selenium.JavascriptExecutor
import org.scalatest.concurrent.Eventually
import org.scalatest.time.{Minute, Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, GivenWhenThen}
import selenium.contributions.pages.{ContributionThankYou, ContributionsLanding}
import selenium.util._

import org.scalatest.featurespec.AnyFeatureSpec
class OneOffContributionsSpec
    extends AnyFeatureSpec
    with GivenWhenThen
    with BeforeAndAfter
    with BeforeAndAfterAll
    with Browser
    with Eventually {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  override implicit val patienceConfig = PatienceConfig(Span(1, Minute), Span(5, Seconds))

  before {
    driverConfig.reset()
  }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  Feature("Sign up for a one-off contribution (New Contributions Flow)") {

    Scenario("One-off contribution sign-up with Stripe - AUD") {

      val stripePayment = 22.55
      val testUser = new PostDeployTestUser(driverConfig)
      val landingPage = ContributionsLanding("au", testUser)
      val contributionThankYou = new ContributionThankYou("au")

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("the user selects the one-time option")
      landingPage.clickOneOff

      And("they click the other-amount button")
      landingPage.clickOtherAmount

      And("they manually enter an amount in the other-amount field")
      landingPage.enterAmount(stripePayment)

      Given("The user fills in their details correctly")
      landingPage.fillInPersonalDetails(hasNameFields = false)

      Given("that the user selects to pay with Stripe")
      When("they press the Stripe payment button")
      landingPage.selectStripePayment()

      And("enter card details")
      landingPage.fillInCardDetails(hasZipCodeField = false)

      And("click the recaptcha")
      landingPage.clickRecaptcha

      When("they click contribute")
      landingPage.clickContribute

      Then("the thankyou page should display")

      eventually {
        assert(contributionThankYou.pageHasLoaded)
      }
    }

    Scenario("Check browser navigates to paypal") {
      val testUser = new TestUser {
        val username = "test-stripe-pop-up"
        driverConfig.addCookie(
          name = "_post_deploy_user",
          value = "true",
        ) // To avoid consent banner, which messes with selenium
      }

      val landingPage = ContributionsLanding("au", testUser)

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)
      landingPage.clearForm(hasNameFields = false)

      When("the user selects the one-time option")
      landingPage.clickOneOff

      Given("The user fills in their details correctly")
      landingPage.fillInPersonalDetails(hasNameFields = false)

      Given("that the user selects to pay with Stripe")
      When("they press the PayPal payment button")
      landingPage.selectPayPalPayment()

      When("they click contribute")
      landingPage.clickContribute

      Then("the browser should navigate to *paypal.com*")
      eventually {
        assert(webDriver.getCurrentUrl.contains("paypal.com"))
      }
    }
  }

}
