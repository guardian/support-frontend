package services

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class MultipleAccountApiServiceSpec extends AnyWordSpec with Matchers {
  "invitationUrl" should {
    "leave alphanumeric invitation codes unchanged" in {
      MultipleAccountApiService.invitationUrl(
        "https://api.example.com",
        "twT95D1SFKBd",
      ) mustBe "https://api.example.com/invitation/twT95D1SFKBd"
    }

    "encode reserved characters in the invitation code path segment" in {
      MultipleAccountApiService.invitationUrl(
        "https://api.example.com",
        "foo/bar?x=1",
      ) mustBe "https://api.example.com/invitation/foo%2Fbar%3Fx=1"
    }

    "append an optional path suffix after the encoded code" in {
      MultipleAccountApiService.invitationUrl(
        "https://api.example.com",
        "foo/bar",
        "/accept",
      ) mustBe "https://api.example.com/invitation/foo%2Fbar/accept"
    }
  }
}
