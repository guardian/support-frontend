package services.mparticle.generic

import com.gu.rest.{CodeBody, WebServiceClientError}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import services.mparticle.generic.RecordCache.Versioned

import scala.concurrent.Future

class RefreshOn401TokenProviderSpec extends AsyncFlatSpec with Matchers {

  class TestRecordCache(tokens: Iterator[String]) extends RecordCache[String] {
    var getCallCount = 0
    var lastExcludedVersion: Option[Int] = None
    private var currentVersion = 0

    override def get(maybeInvalidVersion: Option[Int]): Future[Versioned[String]] = {
      getCallCount += 1
      lastExcludedVersion = maybeInvalidVersion
      if (maybeInvalidVersion.contains(currentVersion)) {
        currentVersion += 1
      }
      if (currentVersion == 0) {
        currentVersion = 1
      }
      Future.successful(Versioned(tokens.next(), currentVersion))
    }
  }

  behavior of "RefreshOn401TokenProvider"

  it should "successfully call function with token" in {
    val mockTokenCache = new TestRecordCache(Iterator("token1", "token2"))
    val provider = new RefreshOn401TokenProvider(mockTokenCache)

    var capturedToken: Option[String] = None
    provider
      .withToken { token =>
        capturedToken = Some(token)
        Future.successful("result")
      }
      .map { result =>
        result shouldBe "result"
        capturedToken shouldBe Some("token1")
        mockTokenCache.getCallCount shouldBe 1
        mockTokenCache.lastExcludedVersion shouldBe None
      }
  }

  it should "retry with new token on 401 error" in {
    val mockTokenCache = new TestRecordCache(Iterator("expired-token", "fresh-token"))
    val provider = new RefreshOn401TokenProvider(mockTokenCache)

    var capturedTokens: List[String] = List.empty

    provider
      .withToken { token =>
        capturedTokens = capturedTokens :+ token
        if (token == "expired-token") {
          Future.failed(WebServiceClientError(CodeBody("401", "Token expired")))
        } else {
          Future.successful(s"Success with $token")
        }
      }
      .map { result =>
        result shouldBe "Success with fresh-token"
        capturedTokens shouldBe List("expired-token", "fresh-token")
        mockTokenCache.getCallCount shouldBe 2
        mockTokenCache.lastExcludedVersion shouldBe Some(1) // second call excluded version 1
      }
  }
  it should "not retry twice on consecutive 401 errors" in {
    val mockTokenCache = new TestRecordCache(Iterator("token1", "token2"))
    val provider = new RefreshOn401TokenProvider(mockTokenCache)

    var callCount = 0
    var capturedTokens: List[String] = List.empty

    provider
      .withToken { token =>
        callCount += 1
        capturedTokens = capturedTokens :+ token
        Future.failed(WebServiceClientError(CodeBody("401", "Unauthorized")))
      }
      .failed
      .map { error =>
        error shouldBe a[WebServiceClientError]
        capturedTokens shouldBe List("token1", "token2")
        mockTokenCache.getCallCount shouldBe 2 // first call, then one retry
        callCount shouldBe 2 // function called twice
      }
  }

  it should "propagate arbitrary exceptions without retry" in {
    val mockTokenCache = new TestRecordCache(Iterator("token1", "token2"))
    val provider = new RefreshOn401TokenProvider(mockTokenCache)

    val testError = new RuntimeException("Some other error")

    provider
      .withToken { token =>
        Future.failed(testError)
      }
      .failed
      .map { error =>
        error shouldBe testError
        mockTokenCache.getCallCount shouldBe 1 // no retry
      }
  }

  it should "propagate non-401 errors without retry" in {
    val mockTokenCache = new TestRecordCache(Iterator("token1", "token2"))
    val provider = new RefreshOn401TokenProvider(mockTokenCache)

    provider
      .withToken { token =>
        Future.failed(WebServiceClientError(CodeBody("403", "Forbidden")))
      }
      .failed
      .map { error =>
        error shouldBe a[WebServiceClientError]
        error.asInstanceOf[WebServiceClientError].codeBody.code shouldBe "403"
        mockTokenCache.getCallCount shouldBe 1 // no retry for 403
      }
  }

}
