package lib.actions

import org.scalatest.{MustMatchers, WordSpec}
import play.api.mvc.Results._
import play.api.test.FakeRequest
import play.api.test.Helpers._

class PrivateActionTest extends WordSpec with MustMatchers {

  "include Cache-control: private" in {
    val result = PrivateAction(Ok("")).apply(FakeRequest())
    header("Cache-Control", result) mustBe Some("private")
  }
}
