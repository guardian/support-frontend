package selenium.subscriptions

import org.openqa.selenium._
import org.scalatest.concurrent.Eventually
import org.scalatest.featurespec.AnyFeatureSpec
import org.scalatest.time.{Minute, Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, GivenWhenThen}
import selenium.subscriptions.pages._
import selenium.util._

class CheckoutsSpec
    extends AnyFeatureSpec
    with GivenWhenThen
    with BeforeAndAfter
    with BeforeAndAfterAll
    with Browser
    with Eventually {

  val driverConfig = new DriverConfig
  override implicit val webDriver: WebDriver = driverConfig.webDriver

  override implicit val patienceConfig: PatienceConfig = PatienceConfig(Span(1, Minute), Span(5, Seconds))

  before {
    driverConfig.reset()
  }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = {
    driverConfig.quit()
    Thread.sleep(100)
  }

  Feature("Paper checkout") {
    Scenario("User already logged in - Direct Debit checkout") {
      testCheckout("Paper", new PaperCheckout, new PaperProductPage, payWithDirectDebit)
    }
  }

  Feature("Guardian Weekly checkout") {
    Scenario("User already logged in - Stripe checkout") {
      testCheckout("Guardian Weekly", new GuardianWeeklyCheckout, new WeeklyProductPage, payWithStripe)
    }
  }

  Feature("Guardian Weekly gift checkout") {
    Scenario("User already logged in - Direct Debit checkout") {
      testCheckout(
        "Guardian Weekly gift",
        new GuardianWeeklyGiftCheckout,
        new WeeklyGiftProductPage,
        payWithDirectDebit,
      )
    }
  }

  def testCheckout(
      checkoutName: String,
      checkoutPage: CheckoutPage,
      productPage: ProductPage,
      paymentFunction: CheckoutPage => Unit,
  ): Unit = {
    new PostDeployTestUser(driverConfig)

    Given("that a user is signed in")
    val signInPage = new SignInPage
    goTo(signInPage)
    signInPage.signIn()

    Given("that a user goes to the UK product page")
    goTo(productPage)

    Given(s"that a user goes to the $checkoutName checkout page")
    goTo(
      checkoutPage,
    ) // TODO: why is this recognised as a test user on https://support.theguardian.com/uk/contribute but not here?

    Then(s"they should be redirected to the $checkoutName checkout page")
    assert(checkoutPage.pageHasLoaded)

    Given("the user fills in their details correctly")
    checkoutPage.fillForm()

    Thread.sleep(1000)
    paymentFunction(checkoutPage)
  }

  def payWithStripe(checkoutPage: CheckoutPage): Unit = {
    Given("that the user selects to pay with Stripe")
    When("they press the Stripe payment button")
    checkoutPage.selectStripePaymentMethod()

    Then("the stripe form loads")
    Thread.sleep(100)
    assert(checkoutPage.stripeFormHasLoaded)

    Given("they fill in the stripe form")
    Thread.sleep(100)
    checkoutPage.fillStripeForm()

    When("they click to process payment")
    Thread.sleep(100)
    checkoutPage.clickStripeSubmit()

    And("the mock calls the backend using a test Stripe token")
    Thread.sleep(100)
    thankYouPage(checkoutPage)
  }

  def payWithDirectDebit(checkoutPage: CheckoutPage): Unit = {

    Given("that the user selects to pay with Direct Debit")
    When("they press the Direct Debit payment button")
    checkoutPage.selectDirectDebitPaymentMethod()

    Then("the direct debit form loads")
    assert(checkoutPage.directDebitFormHasLoaded)

    Given("they fill in the direct debit form")
    checkoutPage.fillDirectDebitForm()

    When("they click Confirm")
    checkoutPage.clickDirectDebitConfirm()

    Given("the playback of the user's details has loaded")
    assert(checkoutPage.directDebitPlaybackHasLoaded)

    When("they click Pay")
    checkoutPage.clickDirectDebitPay()

    thankYouPage(checkoutPage)
  }

  def thankYouPage(checkoutPage: CheckoutPage): Unit = {
    Then("the thank you page should display")
    eventually {
      assert(checkoutPage.thankYouPageHasLoaded)
    }
  }
}
