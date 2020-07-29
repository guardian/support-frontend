package lib

import lib.AuthenticationComponentEvent.SigninRedirectForSupporters
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class AuthenticationComponentEventTest extends AnyFlatSpec with Matchers {
  "createAuthenticationComponentEventTuple" should "create component event parameters" in {
    AuthenticationComponentEvent.createAuthenticationComponentEventTuple(SigninRedirectForSupporters) shouldBe
      "componentEventParams" -> "componentType=identityauthentication&componentId=signin_redirect_for_supporters"
  }
}
