package selenium

import org.scalatest._
import _root_.selenium.pages._
import _root_.selenium.util._

class ContributorSpec extends FeatureSpec with Browser with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll {

  before { Driver.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary()
    dependencyCheck
  }

  override def afterAll(): Unit = { Driver.quit() }

  def dependencyCheck: Unit = {
    assume(
      Dependencies.SupportFrontend.isAvailable,
      s"${Dependencies.SupportFrontend.url} is unavailable! Please run support-frontend locally before running these tests."
    )
    assume(
      Dependencies.IdentityFrontend.isAvailable,
      s"- ${Dependencies.IdentityFrontend.url} is unavailable! Please run identity-frontend locally before running these tests."
    )
    assume(
      Dependencies.ContributionFrontend.isAvailable,
      s"${Dependencies.ContributionFrontend.url} is unavailable! Please run contribution-frontend locally before running these tests."
    )
  }

  feature("Sign up for a Monthly Contribution") {

    scenario("Monthly contribution sign-up with Stripe - GBP", SeleniumTag) {

      val landingPage = ContributionsLanding("uk")

      Given("that a test user goes to the contributions landing page")
      val testUser = new TestUser
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
      assert(MonthlyContribution.pageHasLoaded)

      Given("that the user selects to pay with Stripe")

      When("they press the Stripe payment button")
      MonthlyContribution.selectStripePayment()

      Then("the Stripe Checkout iFrame should display")
      assert(MonthlyContribution.stripeCheckoutHasLoaded)

      Given("that the Stripe Checkout iFrame has the expected fields")
      MonthlyContribution.switchToStripe()
      assert(MonthlyContribution.stripeCheckoutHasCardNumberField)
      assert(MonthlyContribution.stripeCheckoutHasExpiryField)
      assert(MonthlyContribution.stripeCheckoutHasCvcField)
      assert(MonthlyContribution.stripeCheckoutHasSubmitButton)

      When("they fill in valid credit card payment details")
      MonthlyContribution.fillInCreditCardDetails()

      And("they click on the pay button")
      MonthlyContribution.clickStripePayButton()

      Then("the thankyou page should display")
      RecurringContributionThankYou.focusOnDefaultFrame // ensure that we are looking at the main page, and not the Stripe iFrame that may have just closed
      assert(RecurringContributionThankYou.pageHasLoaded)

    }

    scenario("Monthly contribution sign-up with PayPal - USD", SeleniumTag) {

      val landingPage = ContributionsLanding("us")
      val expectedPayment = "10.00"

      Given("that a test user goes to the contributions landing page")
      val testUser = new TestUser
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("they select to contribute the default amount")
      landingPage.clickContribute

      Then("they should be redirected to register as an Identity user")
      val register = Register(testUser, 10)
      assert(register.pageHasLoaded)

      Given("that the user fills in their personal details correctly")
      register.fillInPersonalDetails

      When("they submit the form to create their Identity account")
      register.submit

      Then("they should be redirected to the Monthly Contributions page")
      assert(MonthlyContribution.pageHasLoaded)

      Given("that the user sets their state correctly")
      MonthlyContribution.selectState

      And("they select to pay with PayPal")

      When("they press the PayPal payment button")
      MonthlyContribution.selectPayPalPayment

      Then("the PayPal Express Checkout mini-browser should display")
      PayPalCheckout.switchToPayPalPopUp
      assert(PayPalCheckout.hasLoaded)

      Given("that the user fills in their PayPal credentials correctly")
      MonthlyContribution.fillInPayPalDetails()

      When("the user clicks 'Log In'")
      PayPalCheckout.logIn

      Then("the payment summary appears")
      assert(PayPalCheckout.payPalHasPaymentSummary)

      Given("that the summary displays the correct details")
      assert(PayPalCheckout.payPalSummaryHasCorrectDetails(expectedPayment))

      When("that the user agrees to payment")
      PayPalCheckout.acceptPayPalPaymentPopUp

      Then("the thankyou page should display")
      assert(RecurringContributionThankYou.pageHasLoaded)

    }

  }

  feature("Perform a one-off contribution") {

    scenario("One-off contribution with PayPal - USD", SeleniumTag) {

      val testUser = new TestUser
      val landingPage = ContributionsLanding("us")
      val expectedPayment = "50.00"

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("he/she selects to make a one-time contribution")
      landingPage.clickOneOff

      And("he/she selects to contribute via PayPal")
      landingPage.clickContributePayPalButton

      Then("they should be redirected to PayPal Checkout")
      PayPalCheckout.switchToPayPalPage()
      assert(PayPalCheckout.hasLoaded)

      Given("that the user fills in their PayPal credentials correctly")
      PayPalCheckout.fillIn()

      When("the user clicks 'Log In'")
      PayPalCheckout.logIn

      Then("the payment summary appears")
      assert(PayPalCheckout.payPalHasPaymentSummary)

      Given("that the summary displays the correct details")
      assert(PayPalCheckout.payPalSummaryHasCorrectDetails(expectedPayment))

      When("that the user agrees to payment")
      PayPalCheckout.acceptPayPalPaymentPage

      Then("the thankyou page should display")
      assert(OneOffContributionThankYou.pageHasLoaded)

    }
  }

}
