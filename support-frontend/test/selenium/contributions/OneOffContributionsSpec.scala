package selenium.contributions

import org.scalatest.concurrent.Eventually
import org.scalatest.time.{Minute, Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, FeatureSpec, GivenWhenThen}
import selenium.contributions.pages.{ContributionsLanding, ContributionThankYou}
import selenium.util._

class OneOffContributionsSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser with Eventually {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  override implicit val patienceConfig = PatienceConfig(Span(1, Minute), Span(5, Seconds))

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Sign up for a one-off contribution (New Contributions Flow)") {

    scenario("One-off contribution sign-up with Stripe - AUD") {

      val stripePayment = 22.55
      val testUser = new PostDeployTestUser(driverConfig)
      val landingPage = ContributionsLanding("au", testUser)
      val contributionThankYou = new ContributionThankYou("au")

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("the user selects the one-time option")
      landingPage.clickOneOff

      And("he/she clicks the other-amount button")
      landingPage.clickOtherAmount

      And("he/she manually enters an amount in the other-amount field")
      landingPage.enterAmount(stripePayment)

      Given("The user fills in their details correctly")
      landingPage.fillInPersonalDetails(hasNameFields = false)

      Given("that the user selects to pay with Stripe")
      When("they press the Stripe payment button")
      landingPage.selectStripePayment()

      When("they click contribute")
      landingPage.clickContribute

      And("the mock calls the backend using a test Stripe token")

      Then("the thankyou page should display")

      eventually {
        assert(contributionThankYou.pageHasLoaded)
      }
    }

    scenario("Check browser navigates to paypal") {
      val testUser = new TestUser {
        val username = "test-stripe-pop-up"
        driverConfig.addCookie(name = "GU_TK", value = "1.1") //To avoid consent banner, which messes with selenium
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
