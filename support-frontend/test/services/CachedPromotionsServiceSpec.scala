package services

import com.gu.support.catalog.{DigitalPack, GuardianWeekly, Paper, Product, SupporterPlus, TierThree}
import com.gu.support.config.{PromotionsApiConfig, TouchPointEnvironments}
import com.gu.support.promotions.Promotion
import org.apache.pekko.actor.ActorSystem
import org.scalatest.BeforeAndAfterAll
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec
import services.pricing.DefaultPromotionService

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

class CachedPromotionsServiceSpec extends AnyWordSpec with Matchers with ScalaFutures with BeforeAndAfterAll {
  implicit val defaultPatience: PatienceConfig = PatienceConfig(timeout = 5.seconds, interval = 100.millis)
  implicit val system: ActorSystem = ActorSystem("CachedPromotionsServiceSpec")

  override def afterAll(): Unit = {
    system.terminate()
    super.afterAll()
  }

  private def promotion(promoCode: String): Promotion =
    Promotion.decoder
      .decodeJson(
        io.circe.parser
          .parse(s"""{
        |  "promoCode": "$promoCode",
        |  "name": "Test promo",
        |  "campaignCode": "TEST_CAMPAIGN",
        |  "appliesTo": {"productRatePlanIds": [], "countries": ["GB"]},
        |  "startTimestamp": "2020-01-01T00:00:00.000Z"
        |}""".stripMargin)
          .getOrElse(fail("invalid test fixture json")),
      )
      .getOrElse(fail("failed to decode test fixture Promotion"))

  private val testConfig = PromotionsApiConfig(TouchPointEnvironments.CODE, "https://unused.test", "test-key")

  /** A fake promotions-api backend, so tests don't need real HTTP/JSON wiring - just the promo codes that should be
    * considered "found" when requested.
    */
  private class FakePromotionsApiService(foundCodes: Set[String]) extends PromotionsApiService(null, testConfig) {
    var requestedCodes: List[Seq[String]] = Nil

    override def listByPromoCodes(promoCodes: Seq[String], active: Boolean): Future[List[Promotion]] = {
      requestedCodes = requestedCodes :+ promoCodes
      Future.successful(promoCodes.filter(foundCodes.contains).map(promotion).toList)
    }
  }

  private class FakeDefaultPromotionService(codesByProduct: Map[Product, List[String]])
      extends DefaultPromotionService {
    def getPromoCodes(product: Product): List[String] = codesByProduct.getOrElse(product, Nil)
  }

  "CachedPromotionsService" should {
    "fetch and cache the default promo codes on startup" in {
      val defaults = new FakeDefaultPromotionService(
        Map(
          GuardianWeekly -> List("WEEKLY10"),
          Paper -> List("PAPER20"),
        ),
      )
      val api = new FakePromotionsApiService(foundCodes = Set("WEEKLY10", "PAPER20"))

      val service = new CachedPromotionsService(system, api, defaults, testConfig)

      service.get("WEEKLY10").map(_.promoCode) shouldBe Some("WEEKLY10")
      service.get("PAPER20").map(_.promoCode) shouldBe Some("PAPER20")
      service.get("UNKNOWN") shouldBe None

      api.requestedCodes.flatten.toSet shouldBe Set("WEEKLY10", "PAPER20")
    }

    "resolve additional, ad-hoc promo codes on demand without waiting for the next scheduled poll" in {
      val defaults = new FakeDefaultPromotionService(Map.empty)
      val api = new FakePromotionsApiService(foundCodes = Set("QUERYSTRINGCODE"))

      val service = new CachedPromotionsService(system, api, defaults, testConfig)
      service.get("QUERYSTRINGCODE") shouldBe None

      val result = service.fetchAdditionalCodes(Seq("QUERYSTRINGCODE")).futureValue
      result.get("QUERYSTRINGCODE").map(_.promoCode) shouldBe Some("QUERYSTRINGCODE")
      service.get("QUERYSTRINGCODE").map(_.promoCode) shouldBe Some("QUERYSTRINGCODE")
    }

    "drop codes from the cache that are no longer found/active on a subsequent fetch" in {
      val defaults = new FakeDefaultPromotionService(Map.empty)
      val api = new FakePromotionsApiService(foundCodes = Set("STILLVALID"))

      val service = new CachedPromotionsService(system, api, defaults, testConfig)
      service.fetchAndCache(Seq("STILLVALID", "NOWEXPIRED")).futureValue
      service.get("STILLVALID") shouldBe defined
      service.get("NOWEXPIRED") shouldBe None
    }
  }
}
