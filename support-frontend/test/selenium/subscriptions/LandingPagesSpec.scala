package selenium.subscriptions

import org.scalatest.concurrent.Eventually
import org.scalatest.time.{Minute, Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, FeatureSpec, GivenWhenThen}
import selenium.subscriptions.pages.{DigitalPackSubs, PaperSubs, ProductPage, SubsLandingPage, WeeklySubs}
import selenium.util._

class LandingPagesSpec extends FeatureSpec with GivenWhenThen with BeforeAndAfter with BeforeAndAfterAll with Browser with Eventually {

  val driverConfig = new DriverConfig
  override implicit val webDriver = driverConfig.webDriver

  override implicit val patienceConfig = PatienceConfig(Span(1, Minute), Span(5, Seconds))

  before { driverConfig.reset() }

  override def beforeAll(): Unit = {
    Config.printSummary(driverConfig.sessionId)
    Dependencies.dependencyCheck
  }

  override def afterAll(): Unit = { driverConfig.quit() }

  feature("Paper landing page") {
    scenario("Basic loading") {
      testPageLoads(new PaperSubs())

    }
  }

  feature("Weekly landing page") {
    scenario("Basic loading") {
      testPageLoads(new WeeklySubs())

    }
  }

  feature("Subscriptions landing page") {
    scenario("Basic loading") {
      testPageLoads(new SubsLandingPage())
    }
  }

  feature("Digital Pack landing page") {
    scenario("Basic loading") {
      val testUser = new TestUser(driverConfig)
      testPageLoads(new DigitalPackSubs())
    }
  }


  def testPageLoads(page: ProductPage): Unit ={
    Given("that a user goes to the page")
    goTo(page)
    Then("it should display")
    assert(page.pageHasLoaded)
  }


}
