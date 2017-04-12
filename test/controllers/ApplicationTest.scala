package controllers

import org.scalatest.WordSpec
import org.scalatest.MustMatchers
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, header}
import akka.util.Timeout
import scala.concurrent.duration._

class ApplicationTest extends WordSpec with MustMatchers {

  implicit val timeout = Timeout(2.seconds)

  "/healthcheck" should {
    "return healthy" in {
      val result = new Application().healthcheck.apply(FakeRequest())
      contentAsString(result) mustBe "healthy"
    }

    "not be cached" in {
      val result = new Application().healthcheck.apply(FakeRequest())
      header("Cache-Control", result) mustBe Some("private")
    }
  }
}
