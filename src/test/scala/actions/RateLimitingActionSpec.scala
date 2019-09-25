package actions

import model.PaymentProvider
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{MustMatchers, WordSpec}
import play.api.mvc.{Result, Results}
import play.api.test.FakeRequest
import play.api.test.Helpers._
import services.CloudWatchService

import scala.concurrent.{Await, Future}
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

class RateLimitingActionSpec extends WordSpec with MustMatchers with Results with MockitoSugar {
  val cc = stubControllerComponents()
  val mockCloudWatchService: CloudWatchService = mock[CloudWatchService]

  def newAction(maxRequests: Int, interval: Duration) =
    new RateLimitingAction(
      cc.parsers,
      cc.executionContext,
      mockCloudWatchService,
      RateLimitingSettings(maxRequests, interval),
      PaymentProvider.Stripe
    )

  def makeRequest(action: RateLimitingAction): Future[Result] =
    action
      .apply(Ok(""))
      .apply(FakeRequest())

  "RateLimitingAction" should {
    "Return 200 on first request" in {
      val action = newAction(10, 1.hour)
      val result = makeRequest(action)

      status(result) mustEqual 200
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
