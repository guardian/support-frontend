package selenium

import org.scalatest._
import _root_.selenium.pages._
import _root_.selenium.util._

class RecurringSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Sign up for a Monthly Contribution") {

    scenario("Monthly contribution sign-up with Stripe - GBP") {

      val landingPage = ContributionsLanding("uk")
      val recurringContributionForm = new RecurringContributionForm
      val recurringContributionThankYou = new RecurringContributionThankYou

      Given("that a test user goes to the contributions landing page")
      val testUser = new TestUser(driverConfig)
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("they select to contribute the default amount")
      landingPage.clickContribute

      Then("they should be redirected to register as an Identity user")
      val register = Register(testUser, 10)
      assert(register.pageHasLoaded)

      Given("that the user fills in their personal details correctly")
      register.fillInPersonalDetails()

      When("they submit the form to create their Identity account")
      register.submit()

      Then("they should be redirected to the Monthly Contributions page")
      assert(recurringContributionForm.pageHasLoaded)

      Given("that the user selects to pay with Stripe")

      When("they press the Stripe payment button")
      recurringContributionForm.selectStripePayment()

      And("the mock calls the backend using a test Stripe token")

      Then("the thankyou page should display")
      assert(recurringContributionThankYou.pageHasLoaded)

    }

    scenario("Monthly contribution sign-up with PayPal - USD") {

      val expectedPayment = "15.00"

      val landingPage = ContributionsLanding("us")
      val recurringContributionForm = new RecurringContributionForm
      val payPalCheckout = new PayPalCheckout
      val recurringContributionThankYou = new RecurringContributionThankYou

      Given("that a test user goes to the contributions landing page")
      val testUser = new TestUser(driverConfig)
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("they select to contribute the default amount")
      landingPage.clickContribute

      Then("they should be redirected to register as an Identity user")
      val register = Register(testUser, 15)
      assert(register.pageHasLoaded)

      Given("that the user fills in their personal details correctly")
      register.fillInPersonalDetails

      When("they submit the form to create their Identity account")
      register.submit

      Then("they should be redirected to the Monthly Contributions page")
      assert(recurringContributionForm.pageHasLoaded)

      Given("that the user sets their state correctly")
      recurringContributionForm.selectState

      And("they select to pay with PayPal")

      When("they press the PayPal payment button")
      recurringContributionForm.selectPayPalPayment

      Then("the PayPal Express Checkout mini-browser should display")
      payPalCheckout.switchToPayPalPopUp
      assert(payPalCheckout.hasLoaded)

      Given("that the user fills in their PayPal credentials correctly")
      payPalCheckout.fillIn()

      When("the user clicks 'Log In'")
      payPalCheckout.logIn

      Then("the payment summary appears")
      assert(payPalCheckout.payPalHasPaymentSummary)

      Given("that the summary displays the correct details")
      assert(payPalCheckout.payPalSummaryHasCorrectDetails(expectedPayment))

      When("that the user agrees to payment")
      payPalCheckout.acceptPayPalPaymentPopUp

      Then("the thankyou page should display")
      assert(recurringContributionThankYou.pageHasLoaded)

    }

  }

}
