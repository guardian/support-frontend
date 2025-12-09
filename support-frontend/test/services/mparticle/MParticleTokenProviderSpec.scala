package services.mparticle

import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.{CodeBody, WebServiceClientError}
import com.gu.support.config.Stages
import config.MparticleConfig
import okhttp3.{MediaType, Protocol, Request, Response, ResponseBody}
import org.apache.pekko.actor.ActorSystem
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito._
import org.scalatest.BeforeAndAfterAll
import org.scalatest.concurrent.{Eventually, ScalaFutures}
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

class MParticleTokenProviderSpec
    extends AnyWordSpec
    with Matchers
    with MockitoSugar
    with ScalaFutures
    with Eventually
    with BeforeAndAfterAll {

  implicit val ec: ExecutionContext = ExecutionContext.global
  implicit val system: ActorSystem = ActorSystem("test")
  implicit val defaultPatience: PatienceConfig = PatienceConfig(timeout = 5.seconds, interval = 100.millis)

  override def afterAll(): Unit = {
    system.terminate()
    super.afterAll()
  }

  private def createMockConfig(): MparticleConfig = {
    MparticleConfig(
      clientId = "test-client-id",
      clientSecret = "test-secret",
      apiUrl = "https://api.test.com",
      tokenUrl = "https://oauth.test.com/token",
      orgId = "orgId",
      accountId = "accountId",
      workspaceId = "workspaceId",
      apiEnv = "apiEnv",
    )
  }

  private def createResponse(code: Int, body: String): Response = {
    new Response.Builder()
      .request(new Request.Builder().url("https://test.com").build())
      .protocol(Protocol.HTTP_1_1)
      .code(code)
      .message("Test")
      .body(ResponseBody.create(body, MediaType.parse("application/json")))
      .build()
  }

  "MParticleTokenProvider" should {
    "handle 401 response and retry with different token" in {
      val httpClient = mock[FutureHttpClient]

      // mock token response
      var tokenCounter = 0
      when(httpClient.apply(any[Request])).thenAnswer(_ => {
        tokenCounter += 1
        Future.successful(
          createResponse(
            200,
            s"""{"access_token":"test-token-$tokenCounter","token_type":"Bearer","expires_in":3600}""",
          ),
        )
      })

      val provider = new MParticleTokenProvider(httpClient, createMockConfig(), Stages.CODE)

      // Wait for initial tokens to be fetched
      eventually {
        provider.requestWithToken(token => Future.successful("success")).futureValue shouldBe "success"
      }

      var attemptCount = 0
      val fetch: MParticleAccessToken => Future[String] = { _ =>
        attemptCount += 1
        if (attemptCount == 1) {
          Future.failed(WebServiceClientError(CodeBody("401", "Unauthorized")))
        } else {
          Future.successful("success on retry")
        }
      }

      val result = provider.requestWithToken(fetch)
      result.futureValue shouldBe "success on retry"
      attemptCount should be > 1
    }

    "fail when token pool is empty" in {
      val httpClient = mock[FutureHttpClient]
      val errorResponse = createResponse(500, "Server error")
      when(httpClient.apply(any[Request])).thenReturn(Future.successful(errorResponse))

      val provider = new MParticleTokenProvider(httpClient, createMockConfig(), Stages.CODE)

      val result = provider.requestWithToken(_ => Future.successful("should not succeed"))

      result.failed.futureValue.getMessage should include("No token available")
    }

    "handle error in fetchAndStoreToken with exponential backoff" in {
      val httpClient = mock[FutureHttpClient]
      var callCount = 0

      when(httpClient.apply(any[Request])).thenAnswer(_ => {
        callCount += 1
        if (callCount < 3) {
          Future.successful(createResponse(500, "Server error"))
        } else {
          Future.successful(
            createResponse(
              200,
              """{"access_token":"test-token","token_type":"Bearer","expires_in":3600}""",
            ),
          )
        }
      })

      val provider = new MParticleTokenProvider(httpClient, createMockConfig(), Stages.CODE)

      // Eventually tokens should be fetched after retries
      eventually(timeout(10.seconds)) {
        provider.requestWithToken(token => Future.successful("success")).futureValue shouldBe "success"
      }

      callCount should be >= 3
    }

    "reach max retries on repeated 401 responses" in {
      val httpClient = mock[FutureHttpClient]
      // mock token response
      var tokenCounter = 0
      when(httpClient.apply(any[Request])).thenAnswer(_ => {
        tokenCounter += 1
        Future.successful(
          createResponse(
            200,
            s"""{"access_token":"test-token-$tokenCounter","token_type":"Bearer","expires_in":3600}""",
          ),
        )
      })

      val provider = new MParticleTokenProvider(httpClient, createMockConfig(), Stages.CODE)

      eventually {
        provider.requestWithToken(token => Future.successful("check tokens ready")).futureValue
      }

      val fetch: MParticleAccessToken => Future[String] = { _ =>
        Future.failed(WebServiceClientError(CodeBody("401", "Unauthorized")))
      }

      val result = provider.requestWithToken(fetch)
      result.failed.futureValue.getMessage should include("Max retries")
    }
  }
}
