package selenium

import org.scalatest.{BeforeAndAfterAll, FeatureSpec, GivenWhenThen, Tag}
import _root_.selenium.pages.{ContributionsLanding, MonthlyContribution, Register, ThankYou}
import _root_.selenium.util._

object Selenium extends Tag("Selenium")

class ContributorSpec extends FeatureSpec with Browser with GivenWhenThen with BeforeAndAfterAll {

  override def beforeAll: Unit = {
    Driver.reset()
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
  }

  feature("Sign up for a Monthly Contribution") {

    scenario("Monthly contribution sign-up with Stripe", Selenium) {

      Given("that a test user goes to the contributions landing page")
      val testUser = new TestUser
      goTo(ContributionsLanding)
      assert(ContributionsLanding.pageHasLoaded)

      When("they select to contribute the default amount")
      ContributionsLanding.clickContribute

      Then("they should be redirected to register as an Identity user")
      val register = Register(testUser, 5)
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
      MonthlyContribution.fillInCreditCardPaymentDetailsStripe

      And("they click on the pay button")
      MonthlyContribution.clickStripePayButton()

      Then("the thankyou page should display")
      ThankYou.focusOnDefaultFrame // ensure that we are looking at the main page, and not the Stripe iFrame that may have just closed
      assert(ThankYou.pageHasLoaded)

    }

  }

}
