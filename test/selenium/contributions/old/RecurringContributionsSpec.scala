package selenium.contributions.old

import selenium.contributions.old.pages._
import _root_.selenium.util._
import org.scalatest._

class RecurringContributionsSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Sign up for a Monthly Contribution (Old Contributions Flow)") {

    scenario("Monthly contribution sign-up with Stripe - GBP") {

      val landingPage = ContributionsLanding("uk")
      val testUser = new TestUser(driverConfig)

      val recurringContributionForm = RecurringContributionForm(testUser)
      val recurringContributionThankYou = new RecurringContributionThankYou

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("they select to contribute the default amount")
      landingPage.clickContribute

      Then("they should be redirected to the Monthly Contributions page")
      assert(recurringContributionForm.detailsPageHasLoaded)

      Given("The user fills in their details correctly")
      recurringContributionForm.fillInPersonalDetails()

      When("They select next")
      recurringContributionForm.clickNext

      Then("they should be redirected to the payment page")
      assert(recurringContributionForm.paymentPageHasLoaded)

      Given("that the user selects to pay with Stripe")

      When("they press the Stripe payment button")
      recurringContributionForm.selectStripePayment()

      And("the mock calls the backend using a test Stripe token")

      Then("the thankyou page should display")
      assert(recurringContributionThankYou.pageHasLoaded)

    }

  }

}
