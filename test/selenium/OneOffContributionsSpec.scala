package selenium

import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, FeatureSpec, GivenWhenThen}
import selenium.pages.{ContributionsLanding, OneOffContributionForm, OneOffContributionThankYou}
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

    scenario("One-off contribution sign-up with Stripe - GBP") {

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

      And("he/she manually enters an amount in the other-amount field")
      landingPage.enterAmount(stripePayment)

      And("he/she selects to contribute via Stripe")
      landingPage.clickContribute

      Then("he/she is redirected to the personal details page")
      assert(oneOffContributionForm.pageHasLoaded)

      And("The payment amount on the personal details page is correct")
      assert(oneOffContributionForm.compareAmountDisplayed(stripePayment))

      Given("The user fills in their name and email correctly")
      oneOffContributionForm.fillInPersonalDetails()

      And("The user selects to pay by Card")
      oneOffContributionForm.clickContributeByCard

      And("the mock calls the backend using a test Stripe token")

      Then("the thankyou page should display")
      assert(oneOffContributionThankYou.pageHasLoaded)
    }

    scenario("One-off contribution sign-up with PayPal - USD") {

      val testUser = new TestUser(driverConfig)
      val landingPage = ContributionsLanding("us")
      val payPalCheckout = new PayPalCheckout
      val oneOffContributionThankYou = new OneOffContributionThankYou
      val expectedPayment = "50.00"

      Given("that a test user goes to the contributions landing page")
      goTo(landingPage)
      assert(landingPage.pageHasLoaded)

      When("he/she selects to make a one-time contribution")
      landingPage.clickOneOff

      And("he/she selects to contribute via PayPal")
      landingPage.clickContributePayPalButton

      Then("they should be redirected to PayPal Checkout")
      assert(payPalCheckout.initialPageHasLoaded)
      payPalCheckout.handleGuestRegistrationPage()
      assert(payPalCheckout.loginContainerHasLoaded)

      Given("that the user fills in their PayPal credentials correctly")
      payPalCheckout.enterLoginDetails()

      When("the user clicks 'Log In'")
      payPalCheckout.logIn

      Then("the payment summary appears")
      assert(payPalCheckout.payPalHasPaymentSummary)

      Given("that the summary displays the correct details")
      assert(payPalCheckout.payPalSummaryHasCorrectDetails(expectedPayment))

      When("that the user agrees to payment")
      payPalCheckout.acceptPayPalPaymentPage

      Then("the thankyou page should display")
      assert(oneOffContributionThankYou.pageHasLoaded)

    }
  }

}
