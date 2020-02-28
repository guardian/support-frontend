package models.identity.requests

import play.api.libs.json.Json
import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.should.Matchers

class CreateGuestAccountRequestBodyTest extends AnyWordSpec with Matchers {

  "CreateGuestAccountRequestBody" should {

    "be serialised as JSON" in {

      val body = CreateGuestAccountRequestBody.fromEmail("test.user@theguardian.com")

      Json.toJson(body).toString shouldEqual
        """{"primaryEmailAddress":"test.user@theguardian.com"}"""
    }
  }
}
