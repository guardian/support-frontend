package selenium

import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, FeatureSpec, GivenWhenThen}
import selenium.pages.{ContributionsLanding, OneOffContributionThankYou}
import selenium.util._

class OneOffContributionsSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Perform a one-off contribution") {

    scenario("One-off contribution with PayPal - USD") {

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
      payPalCheckout.switchToPayPalPage()
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
      payPalCheckout.acceptPayPalPaymentPage

      Then("the thankyou page should display")
      assert(oneOffContributionThankYou.pageHasLoaded)

    }
  }

}
