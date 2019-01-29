package selenium.contributions.new_flow

import selenium.contributions.new_flow.pages._
import _root_.selenium.util._
import org.scalatest._
import org.scalatest.concurrent.Eventually
import org.scalatest.time.{Minute, Seconds, Span}

class RecurringContributionsSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser with Eventually {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  override implicit val patienceConfig = PatienceConfig(Span(1, Minute), Span(5, Seconds))

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Sign up for a Monthly Contribution (New Contributions Flow)") {

    scenario("Monthly contribution sign-up with Stripe - GBP") {

      val testUser = new TestUser(driverConfig)
      val landingPage = ContributionsLanding("uk", testUser)

      val contributionThankYou = new ContributionThankYou("uk")

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("the user selects the monthly option")
      landingPage.clickMonthly

      Given("The user fills in their details correctly")
      landingPage.clearForm()
      landingPage.fillInPersonalDetails(hasNameFields = true)

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

    scenario("Annual contribution sign-up with Stripe - USD") {

      val testUser = new TestUser(driverConfig)
      val landingPage = ContributionsLanding("us", testUser)
      val contributionThankYou = new ContributionThankYou("us")

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("the user selects the annual option")
      landingPage.clickAnnual

      Given("The user fills in their details correctly")
      landingPage.clearForm()
      landingPage.fillInPersonalDetails(hasNameFields = true)
      landingPage.selectState

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

  }

}
