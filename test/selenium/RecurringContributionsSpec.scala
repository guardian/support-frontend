package selenium

import org.scalatest._
import _root_.selenium.pages._
import _root_.selenium.util._

class RecurringContributionsSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Sign up for a Monthly Contribution") {

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

    scenario("Monthly contribution sign-up with Paypal - USD") {

      val landingPage = ContributionsLanding("us")
      val testUser = new TestUser(driverConfig)
      val registerPageOne = RegisterPageOne(testUser, 15)
      val payPalCheckout = new PayPalCheckout
      val expectedPayment = "15.00"
      val recurringContributionForm = RecurringContributionForm(testUser)
      val recurringContributionThankYou = new RecurringContributionThankYou

      goTo(registerPageOne)

      assert(registerPageOne.pageHasLoaded)

      Given("that the user fills in their personal details correctly")
      registerPageOne.fillInPersonalDetails()

      When("they submit the form to create their Identity account")
      registerPageOne.submit()
      Then("they should be redirected to register as an Identity user")

      val registerPageTwo = RegisterPageTwo(testUser, 15)
      assert(registerPageTwo.pageHasLoaded)

      Given("that the user fills in their personal details correctly")
      registerPageTwo.fillInPersonalDetails()

      When("they submit the form to create their Identity account")

      registerPageTwo.submit()

      goTo(landingPage)

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("they select to contribute the default amount")
      landingPage.clickContribute

      Then("they should be redirected to the Monthly Contributions page")
      assert(recurringContributionForm.detailsPageHasLoaded)

      Given("They select next")
      recurringContributionForm.clickNext

      Then("they should be redirected to the payment page")
      assert(recurringContributionForm.paymentPageHasLoaded)

      Given("they select to pay with PayPal")

      When("they press the PayPal payment button")
      recurringContributionForm.selectPayPalPayment

      Then("the PayPal Express Checkout mini-browser should display")
      payPalCheckout.switchToPayPalPopUp
      assert(payPalCheckout.initialPageHasLoaded)
      payPalCheckout.handleGuestRegistrationPage()
      assert(payPalCheckout.loginContainerHasLoaded)

      Given("that the user fills in their PayPal credentials correctly")
      payPalCheckout.enterLoginDetails()

      When("the user clicks 'Log In'")
      payPalCheckout.logIn

      Then("the payment summary appears")
      assert(payPalCheckout.payPalSummaryHasLoaded)

      Given("that the summary displays the correct details")
      assert(payPalCheckout.payPalSummaryHasCorrectDetails(expectedPayment))

      When("that the user agrees to payment")
      payPalCheckout.acceptPayPalPaymentPopUp

      Then("the thankyou page should display")
      assert(recurringContributionThankYou.pageHasLoaded)

    }

  }

}
