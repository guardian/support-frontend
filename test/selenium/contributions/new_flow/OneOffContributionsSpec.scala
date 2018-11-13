package selenium.contributions.new_flow

import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, FeatureSpec, GivenWhenThen}
import selenium.contributions.new_flow.pages.{ContributionsLanding, OneOffContributionForm, OneOffContributionThankYou}
import selenium.util._

class OneOffContributionsSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Sign up for a one-off contribution") {

    scenario("One-off contribution sign-up with Stripe - AUD") {

      val stripePayment = 22.55
      val currency = "AUD"
      val testUser = new TestUser(driverConfig)
      val landingPage = ContributionsLanding("au")
      val oneOffContributionForm = OneOffContributionForm(testUser, stripePayment.toInt, currency)
      val oneOffContributionThankYou = new OneOffContributionThankYou

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("he/she selects to make a one-time contribution")
      landingPage.clickOneOff

      And("he/she clicks the other-amount button")
      landingPage.clickOtherAmount

      And("he/she manually enters an amount in the other-amount field")
      landingPage.enterAmount(stripePayment)

      Given("The user fills in their details correctly")
      oneOffContributionForm.fillInPersonalDetails()

      Given("that the user selects to pay with Stripe")
      When("they press the Stripe payment button")
      oneOffContributionForm.clickContributeByCard()

      When("they click contribute")
      landingPage.clickContribute

      //TODO - hangs here
      And("the mock calls the backend using a test Stripe token")

      Then("the thankyou page should display")
      assert(oneOffContributionThankYou.pageHasLoaded)
    }

  }

}
