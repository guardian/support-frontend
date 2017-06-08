package lib.actions

import com.gu.identity.play.AuthenticatedIdUser
import org.scalatest.mockito.MockitoSugar._
import org.scalatest.{MustMatchers, WordSpec}
import play.api.mvc.Results._
import play.api.test.FakeRequest
import play.api.test.Helpers._
import scala.concurrent.ExecutionContext.Implicits.global

class PrivateActionTest extends WordSpec with MustMatchers {

  val actionRefiner = new ActionRefiners(_ => Some(mock[AuthenticatedIdUser]), "", "")

  "include Cache-control: private" in {
    val result = actionRefiner.PrivateAction(Ok("")).apply(FakeRequest())
    header("Cache-Control", result) mustBe Some("private")
  }
}
