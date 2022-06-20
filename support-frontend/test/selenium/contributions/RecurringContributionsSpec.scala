package selenium.contributions

import selenium.contributions.pages._
import _root_.selenium.util._
import org.scalatest._
import org.scalatest.concurrent.Eventually
import org.scalatest.featurespec.AnyFeatureSpec
import org.scalatest.time.{Minute, Seconds, Span}

class RecurringContributionsSpec
    extends AnyFeatureSpec
    with GivenWhenThen
    with BeforeAndAfter
    with BeforeAndAfterAll
    with Browser
    with Eventually {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  override implicit val patienceConfig = PatienceConfig(Span(1, Minute), Span(5, Seconds))

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  Feature("Sign up for a Recurring Contribution (New Contributions Flow)") {

    Scenario("Monthly contribution sign-up with Stripe - GBP") {

      val testUser = new PostDeployTestUser(driverConfig)
      val landingPage = ContributionsLanding("uk", testUser)

      val contributionThankYou = new ContributionThankYou("uk")

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("the user selects the monthly option")
      landingPage.clickMonthly

      Given("The user fills in their details correctly")
      landingPage.clearForm(hasNameFields = true)
      landingPage.fillInPersonalDetails(hasNameFields = true)

      Given("that the user selects to pay with Stripe")
      When("they press the Stripe payment button")
      landingPage.selectStripePayment()

      And("enter card details")
      landingPage.fillInCardDetails(hasZipCodeField = false)

      And("click the recaptcha")
      landingPage.clickRecaptcha

      When("they click contribute")
      landingPage.clickContribute

      And("the mock calls the backend using a test Stripe token")

      Then("the thankyou page should display")
      eventually {
        assert(contributionThankYou.pageHasLoaded)
      }

    }

//    Scenario("Monthly contribution sign-up with direct debit - GBP") {
//
//      val testUser = new PostDeployTestUser(driverConfig)
//      val landingPage = ContributionsLanding("uk", testUser)
//
//      val contributionThankYou = new ContributionThankYou("uk")
//
//      Given("that a test user goes to the contributions landing page")
//      goTo(landingPage)
//      assert(landingPage.pageHasLoaded)
//
//      When("the user selects the monthly option")
//      landingPage.clickMonthly
//
//      Given("The user fills in their details correctly")
//      landingPage.clearForm(hasNameFields = true)
//      landingPage.fillInPersonalDetails(hasNameFields = true)
//
//      Given("that the user selects to pay with direct debit")
//      When("they press the direct debit payment button")
//      landingPage.selectDirectDebit()
//      landingPage.clickContribute
//
//      And("enter direct debit details")
//      landingPage.fillInDirectDebitDetails()
//
//      When("they click to pay")
//      landingPage.payDirectDebit()
//
//      Then("the thankyou page should display")
//      eventually {
//        assert(contributionThankYou.pageHasLoaded)
//      }
//
//    }

    Scenario("Annual contribution sign-up with Stripe - USD") {

      val testUser = new PostDeployTestUser(driverConfig)
      val landingPage = ContributionsLanding("us", testUser)
      val contributionThankYou = new ContributionThankYou("us")

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("the user selects the annual option")
      landingPage.clickAnnual

      Given("the user fills in their details correctly")
      landingPage.clearForm(hasNameFields = true)
      landingPage.fillInPersonalDetails(hasNameFields = true)
      landingPage.selectState

      Given("that the user selects to pay with Stripe")
      When("they press the Stripe payment button")
      landingPage.selectStripePayment()

      And("enter card details")
      landingPage.fillInCardDetails(hasZipCodeField = true)

      And("click the recaptcha")
      landingPage.clickRecaptcha

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
