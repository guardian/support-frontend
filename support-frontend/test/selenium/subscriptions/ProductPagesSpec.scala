package selenium.subscriptions

import org.openqa.selenium.WebDriver
import org.scalatest.concurrent.Eventually
import org.scalatest.featurespec.AnyFeatureSpec
import org.scalatest.time.{Minute, Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, GivenWhenThen}
import selenium.subscriptions.pages._
import selenium.util._

class ProductPagesSpec
    extends AnyFeatureSpec
    with GivenWhenThen
    with BeforeAndAfter
    with BeforeAndAfterAll
    with Browser
    with Eventually {

  val driverConfig = new DriverConfig
  override implicit val webDriver: WebDriver = driverConfig.webDriver

  override implicit val patienceConfig: PatienceConfig = PatienceConfig(Span(1, Minute), Span(5, Seconds))

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  Feature("Paper product page") {
    Scenario("Basic loading") {
      testPageLoads(new PaperProductPage())
    }
  }

  Feature("Weekly product page") {
    Scenario("Basic loading") {
      testPageLoads(new WeeklyProductPage())
    }
  }

  Feature("Weekly gift product page") {
    Scenario("Basic loading") {
      testPageLoads(new WeeklyGiftProductPage())
    }
  }

  Feature("Subscriptions landing page") {
    Scenario("Basic loading") {
      testPageLoads(new SubsLandingPage())
    }
  }

  Feature("Digital Pack product page") {
    Scenario("Basic loading") {
      testPageLoads(new DigitalPackProductPage())
    }
  }

  Feature("Digital Pack gift product page") {
    Scenario("Basic loading") {
      testPageLoads(new DigitalPackGiftProductPage())
    }
  }

  def testPageLoads(page: ProductPage): Unit = {
    Given("that a user goes to the page")
    goTo(page)
    Then("it should display")
    assert(page.pageHasLoaded)
  }

}
