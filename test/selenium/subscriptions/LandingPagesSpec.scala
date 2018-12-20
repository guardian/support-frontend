package selenium.subscriptions

import org.scalatest.concurrent.Eventually
import org.scalatest.time.{Minute, Seconds, Span}
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, FeatureSpec, GivenWhenThen}
import selenium.subscriptions.pages.{PaperSubs, WeeklySubs}
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

  feature("Subscription landing pages") {

    scenario("Basic loading") {

      val paperSubsPage = new PaperSubs()
      val weeklySubsPage = new WeeklySubs()
      
      Given("that a test user goes to the paper subs landing page")
      goTo(paperSubsPage)
      assert(paperSubsPage.pageHasLoaded)

      Given("that a test user goes to the GW landing page")
      goTo(weeklySubsPage)
      assert(weeklySubsPage.pageHasLoaded)

    }

  }

}
