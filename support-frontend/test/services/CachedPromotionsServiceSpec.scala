package services

import com.gu.support.config.{PromotionsApiConfig, TouchPointEnvironments}
import com.gu.support.promotions.PromoWithCatalogInformation
import org.apache.pekko.actor.ActorSystem
import org.scalatest.BeforeAndAfterAll
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec

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

  private def promotion(promoCode: String): PromoWithCatalogInformation =
    PromoWithCatalogInformation.decoder
      .decodeJson(
        io.circe.parser
          .parse(s"""{
        |  "promoCode": "$promoCode",
        |  "name": "Test promo",
        |  "campaignCode": "TEST_CAMPAIGN",
        |  "appliesTo": {"productRatePlanIds": [], "countries": ["GB"], "catalogRatePlans": []},
        |  "startTimestamp": "2020-01-01T00:00:00.000Z"
        |}""".stripMargin)
          .getOrElse(fail("invalid test fixture json")),
      )
      .getOrElse(fail("failed to decode test fixture PromoWithCatalogInformation"))

  private val testConfig = PromotionsApiConfig(TouchPointEnvironments.CODE, "https://unused.test", "test-key")

  /** A fake promotions-api backend, so tests don't need real HTTP/JSON wiring. */
  private class FakePromotionsApiService(
      var activeCodes: List[String],
      inactiveCodes: Set[String] = Set.empty,
  ) extends PromotionsApiService(null, testConfig) {
    var failing = false
    var requestedCodes: List[Seq[String]] = Nil

    override def listActive(): Future[List[PromoWithCatalogInformation]] =
      if (failing) Future.failed(new RuntimeException("promotions-api unavailable"))
      else Future.successful(activeCodes.map(promotion))

    override def listByPromoCodes(
        promoCodes: Seq[String],
        active: Option[Boolean],
    ): Future[List[PromoWithCatalogInformation]] = {
      requestedCodes = requestedCodes :+ promoCodes
      if (failing) Future.failed(new RuntimeException("promotions-api unavailable"))
      else Future.successful(promoCodes.filter((activeCodes.toSet ++ inactiveCodes).contains).map(promotion).toList)
    }
  }

  "CachedPromotionsService.getActive" should {
    "return the active promotions for the requested codes, in the requested order, omitting any others" in {
      val api = new FakePromotionsApiService(activeCodes = List("WEEKLY10", "PAPER20"))
      val service = new CachedPromotionsService(system, api, testConfig)

      service.getActive(Seq("PAPER20", "UNKNOWN", "WEEKLY10")).map(_.promoCode) shouldBe Seq("PAPER20", "WEEKLY10")
      api.requestedCodes shouldBe empty
    }

    "replace the cached promotions on refresh, so promotions which are no longer active are dropped" in {
      val api = new FakePromotionsApiService(activeCodes = List("OLD"))
      val service = new CachedPromotionsService(system, api, testConfig)

      api.activeCodes = List("NEW")
      service.refresh().futureValue

      service.getActive(Seq("OLD", "NEW")).map(_.promoCode) shouldBe Seq("NEW")
    }

    "keep the previously cached promotions if a refresh fails" in {
      val api = new FakePromotionsApiService(activeCodes = List("WEEKLY10"))
      val service = new CachedPromotionsService(system, api, testConfig)

      api.failing = true
      service.refresh().failed.futureValue

      service.getActive(Seq("WEEKLY10")).map(_.promoCode) shouldBe Seq("WEEKLY10")
    }
  }

  "CachedPromotionsService.get" should {
    "return a cached active promotion without calling promotions-api" in {
      val api = new FakePromotionsApiService(activeCodes = List("WEEKLY10"))
      val service = new CachedPromotionsService(system, api, testConfig)

      service.get("WEEKLY10").futureValue.map(_.promoCode) shouldBe Some("WEEKLY10")
      api.requestedCodes shouldBe empty
    }

    "fetch a promotion which isn't cached, e.g. an expired promotion" in {
      val api = new FakePromotionsApiService(activeCodes = Nil, inactiveCodes = Set("EXPIRED"))
      val service = new CachedPromotionsService(system, api, testConfig)

      service.get("EXPIRED").futureValue.map(_.promoCode) shouldBe Some("EXPIRED")
      service.get("UNKNOWN").futureValue shouldBe None
      api.requestedCodes shouldBe List(Seq("EXPIRED"), Seq("UNKNOWN"))
    }
  }
}
