package actions

import model.PaymentProvider
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import play.api.mvc.{Result, Results}
import play.api.test.FakeRequest
import play.api.test.Helpers._
import services.CloudWatchService

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.FiniteDuration
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

class RateLimitingActionSpec extends AnyWordSpec with Matchers with Results with MockitoSugar {
  val cc = stubControllerComponents()
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  private def newAction(maxRequests: Int, interval: FiniteDuration) =
    new RateLimitingAction(
      cc.parsers,
      cc.executionContext,
      mockCloudWatchService,
      RateLimitingSettings(maxRequests, interval),
      PaymentProvider.Stripe,
      "PROD"
    )

  def makeRequest(action: RateLimitingAction): Future[Result] =
    action
      .apply(Ok(""))
      .apply(FakeRequest().withHeaders("X-Forwarded-For" -> "192.168.0.1"))

  "RateLimitingAction" should {
    "Return 200 on first request" in {
      val action = newAction(10, 1.hour)
      val result = makeRequest(action)

      status(result) mustBe 200
    }

    "Return 429 if rate limit exceeded" in {
      val action = newAction(2, 1.hour)

      val futureResults = for {
        first <- makeRequest(action)
        second <- makeRequest(action)
        third <- makeRequest(action)
      } yield (first, second, third)

      val (firstResult, secondResult, thirdResult) = Await.result(futureResults, atMost = 5.seconds)

      firstResult.header.status mustEqual 200
      secondResult.header.status mustEqual 200
      thirdResult.header.status mustEqual 429
    }
  }
}
