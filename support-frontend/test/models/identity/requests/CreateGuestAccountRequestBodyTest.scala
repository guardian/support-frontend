package models.identity.requests

import org.scalatest.{Matchers, WordSpec}
import play.api.libs.json.Json

class CreateGuestAccountRequestBodyTest extends WordSpec with Matchers {

  "CreateGuestAccountRequestBody" should {

    "be serialised as JSON" in {

      val body = CreateGuestAccountRequestBody.fromEmail("test.user@theguardian.com")

      Json.toJson(body).toString shouldEqual
        """{"primaryEmailAddress":"test.user@theguardian.com","publicFields":{"displayName":"test.user"}}"""
    }
  }
}
