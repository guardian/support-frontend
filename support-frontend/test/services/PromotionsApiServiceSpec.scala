package services

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.support.config.{PromotionsApiConfig, TouchPointEnvironments}
import okhttp3.{MediaType, Protocol, Request, Response, ResponseBody}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito._
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

class PromotionsApiServiceSpec extends AnyWordSpec with Matchers with MockitoSugar with ScalaFutures {
  implicit val defaultPatience: PatienceConfig = PatienceConfig(timeout = 5.seconds, interval = 100.millis)

  private def jsonResponse(code: Int, body: String): Response =
    new Response.Builder()
      .request(new Request.Builder().url("https://promotions-api.test.com/promotions").build())
      .protocol(Protocol.HTTP_1_1)
      .code(code)
      .message("Test")
      .body(ResponseBody.create(body, MediaType.parse("application/json")))
      .build()

  private val validPromotionsResponse =
    """{
      |  "promotions": [
      |    {
      |      "promoCode": "SPRING26",
      |      "name": "Spring 25% off",
      |      "campaignCode": "SPRING_CAMPAIGN",
      |      "appliesTo": {
      |        "productRatePlanIds": ["8a128ed885fc6ded018602296ace3eb8"],
      |        "countries": ["GB"],
      |        "catalogRatePlans": [{"productKey": "SupporterPlus", "productRatePlanKey": "Monthly"}]
      |      },
      |      "startTimestamp": "2026-01-01T00:00:00.000Z",
      |      "endTimestamp": "2099-01-01T00:00:00.000Z",
      |      "discount": {"amount": 25, "durationMonths": 3},
      |      "isIntroductoryPricing": true
      |    }
      |  ]
      |}""".stripMargin

  "PromotionsApiService" should {
    "decode a promotions-api response into PromoWithCatalogInformation, including when description is absent" in {
      val httpClient = mock[FutureHttpClient]
      when(httpClient.apply(any[Request])).thenReturn(Future.successful(jsonResponse(200, validPromotionsResponse)))

      val service = new PromotionsApiService(
        httpClient,
        PromotionsApiConfig(TouchPointEnvironments.CODE, "https://promotions-api.test.com", "test-key"),
      )
      val result = service.listByPromoCodes(Seq("SPRING26")).futureValue

      result should have size 1
      result.head.promoCode shouldBe "SPRING26"
      result.head.campaignCode shouldBe "SPRING_CAMPAIGN"
      result.head.description shouldBe None // absent from the response
      result.head.isIntroductoryPricing shouldBe Some(true)
      result.head.discount.map(_.amount) shouldBe Some(25)
    }

    "send the promoCodes and active params, and the x-api-key header" in {
      val httpClient = mock[FutureHttpClient]
      when(httpClient.apply(any[Request])).thenReturn(
        Future.successful(jsonResponse(200, """{"promotions": []}""")),
      )

      val service = new PromotionsApiService(
        httpClient,
        PromotionsApiConfig(TouchPointEnvironments.CODE, "https://promotions-api.test.com", "test-key"),
      )
      service.listByPromoCodes(Seq("FOO", "BAR"), Some(true)).futureValue

      val captor = org.mockito.ArgumentCaptor.forClass(classOf[Request])
      verify(httpClient).apply(captor.capture())
      val req = captor.getValue
      req.header("x-api-key") shouldBe "test-key"
      req.url.queryParameter("promoCodes") shouldBe "FOO,BAR"
      req.url.queryParameter("active") shouldBe "true"
    }

    "omit the active param entirely when active = None, rather than sending active=false - which would " +
      "incorrectly filter to only inactive/expired promotions, not \"no filter\"" in {
        val httpClient = mock[FutureHttpClient]
        when(httpClient.apply(any[Request])).thenReturn(
          Future.successful(jsonResponse(200, """{"promotions": []}""")),
        )

        val service = new PromotionsApiService(
          httpClient,
          PromotionsApiConfig(TouchPointEnvironments.CODE, "https://promotions-api.test.com", "test-key"),
        )
        service.listByPromoCodes(Seq("FOO", "BAR"), active = None).futureValue

        val captor = org.mockito.ArgumentCaptor.forClass(classOf[Request])
        verify(httpClient).apply(captor.capture())
        val req = captor.getValue
        req.url.queryParameter("promoCodes") shouldBe "FOO,BAR"
        req.url.queryParameter("active") shouldBe null
      }

    "not make a request when no promo codes are given" in {
      val httpClient = mock[FutureHttpClient]
      val service = new PromotionsApiService(
        httpClient,
        PromotionsApiConfig(TouchPointEnvironments.CODE, "https://promotions-api.test.com", "test-key"),
      )

      service.listByPromoCodes(Nil).futureValue shouldBe Nil
      verify(httpClient, never()).apply(any[Request])
    }

    "throw if given more than 100 distinct promo codes" in {
      val httpClient = mock[FutureHttpClient]
      val service = new PromotionsApiService(
        httpClient,
        PromotionsApiConfig(TouchPointEnvironments.CODE, "https://promotions-api.test.com", "test-key"),
      )

      an[IllegalArgumentException] should be thrownBy service.listByPromoCodes((1 to 101).map(i => s"CODE$i"))
      verify(httpClient, never()).apply(any[Request])
    }
  }
}
