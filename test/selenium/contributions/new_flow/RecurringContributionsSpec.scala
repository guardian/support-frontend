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

  feature("Sign up for a Monthly Contribution") {

    scenario("Monthly contribution sign-up with Stripe - GBP") {

      val landingPage = ContributionsLanding("uk")
      val testUser = new TestUser(driverConfig)

      val recurringContributionForm = RecurringContributionForm(testUser)
      val recurringContributionThankYou = new ContributionThankYou("uk")

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      Given("The user fills in their details correctly")
      recurringContributionForm.clearForm()
      recurringContributionForm.fillInPersonalDetails()

      Given("that the user selects to pay with Stripe")
      When("they press the Stripe payment button")
      recurringContributionForm.selectStripePayment()

      When("they click contribute")
      landingPage.clickContribute

      And("the mock calls the backend using a test Stripe token")

      Then("the thankyou page should display")
      eventually {
        assert(recurringContributionThankYou.pageHasLoaded)
      }

    }

    scenario("Monthly contribution sign-up with Paypal - USD") {

      val landingPage = ContributionsLanding("us")
      val testUser = new TestUser(driverConfig)
      val payPalCheckout = new PayPalCheckout
      val expectedPayment = "15.00"
      val recurringContributionForm = RecurringContributionForm(testUser)
      val recurringContributionThankYou = new ContributionThankYou("us")

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      Given("The user fills in their details correctly")
      recurringContributionForm.clearForm()
      recurringContributionForm.fillInPersonalDetails()
      recurringContributionForm.selectState

      Given("that the user selects to pay with PayPal")
      When("they press the Stripe payment button")
      recurringContributionForm.selectPayPalPayment()

      When("they click contribute")
      landingPage.clickContributePayPalButton

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
      eventually {
        assert(recurringContributionThankYou.pageHasLoaded)
      }

    }

  }

}
