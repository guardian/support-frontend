package selenium.subscriptions

import org.scalatest.concurrent.Eventually
import org.scalatest.time.{Minute, Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, FeatureSpec, GivenWhenThen}
import selenium.subscriptions.pages.{DigitalPackCheckout, Register}
import selenium.util._

class CheckoutsSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser with Eventually {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  override implicit val patienceConfig = PatienceConfig(Span(1, Minute), Span(5, Seconds))

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Digital Pack checkout") {
    scenario("Credit card checkout") {
      val testUser = new TestUser(driverConfig)
      val checkoutPage = new DigitalPackCheckout(testUser)

      Given("that a user goes to the Digital Pack checkout page")
      goTo(checkoutPage)

      Then("they should be redirected to register as an Identity user")
      val register = Register(testUser, "digital")
      assert(register.firstPageHasLoaded)

      Given("that the user fills in their email address")
      register.fillInEmail()

      When("they click the next button")
      register.next()

      Then("they should be taken to the second register page")
      assert(register.secondPageHasLoaded)

      Given("that the user fills in the rest of their details")
      register.fillInPersonalDetails()

      When("they click the create account button")
      register.createAccount()

      Then("they should be redirected to the Digital Pack checkout page")
      assert(checkoutPage.pageHasLoaded)

      Given("The user fills in their details correctly")
      checkoutPage.fillInAddress()

      Given("that the user selects to pay with Stripe")
      When("they press the Stripe payment button")
      checkoutPage.selectStripePayment()

      When("they click continue to payment")
      checkoutPage.clickSubmit

      And("the mock calls the backend using a test Stripe token")

      Then("the thankyou page should display")
      eventually {
        assert(checkoutPage.thankYouPageHasLoaded)
      }
    }
  }
}
