package selenium.subscriptions

import org.scalatest.concurrent.Eventually
import org.scalatest.time.{Minute, Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, FeatureSpec, GivenWhenThen}
import selenium.contributions.pages.{ContributionThankYou, ContributionsLanding}
import selenium.subscriptions.pages._
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
      val productPage = new DigitalPackProductPage()
      val checkoutPage = new DigitalPackCheckout("uk", testUser)

      val contributionThankYou = new ContributionThankYou("uk")

      Given("that a test user goes to the Digital Pack landing page")
      goTo(productPage)
      assert(productPage.pageHasLoaded)

      When("the user clicks on the subscription options button")
      productPage.clickSubscriptionOptions

      Then("they should scroll down to the subscription options")
      productPage.hasScrolledToSubscriptionOptions

      Given("the user selects the monthly option")
      productPage.clickMonthly

      Then("they should be redirected to register as an Identity user")
      val register = Register(testUser, "digital")
      assert(register.pageHasLoaded)
//
//      Given("that the user fills in their personal details correctly")
//      register.fillInPersonalDetails()
//
//      When("they submit the form to create their Identity account")
//      register.submit()
//
//      Then("they should be redirected to the Digital Pack checkout page")
//      assert(checkoutPage.pageHasLoaded)

//      Given("The user fills in their details correctly")
//      checkoutPage.clearForm()
//      checkoutPage.fillInPersonalDetails(hasNameFields = true)
//
//      Given("that the user selects to pay with Stripe")
//      When("they press the Stripe payment button")
//      checkoutPage.selectStripePayment()
//
//      When("they click contribute")
//      landingPage.clickContribute
//
//      And("the mock calls the backend using a test Stripe token")
//
//      Then("the thankyou page should display")
//      eventually {
//        assert(contributionThankYou.pageHasLoaded)
//      }
    }
  }

}
